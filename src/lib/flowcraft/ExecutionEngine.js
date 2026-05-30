export class ExecutionEngine {
  constructor(nodes, edges, initialPayload = {}) {
    this.nodes = nodes;
    this.edges = edges;
    
    // Convert arrays to lookup maps
    this.nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    // Environment stores the output of each node by ID
    this.env = new Map();
    this.env.set('initial', initialPayload);

    // Track execution status and logs
    this.logs = [];
    this.status = 'PENDING'; // PENDING, RUNNING, SUCCESS, ERROR
  }

  log(nodeId, message, data = null) {
    this.logs.push({ timestamp: new Date(), nodeId, message, data });
  }

  // Parse {{json.path}} templates recursively in config objects
  interpolateValues(config, contextData) {
    if (typeof config === 'string') {
      return config.replace(/\{\{([^\}]+)\}\}/g, (match, path) => {
        const parts = path.trim().split('.');
        let current = contextData;
        for (const p of parts) {
          if (current === undefined || current === null) return match;
          current = current[p];
        }
        return current !== undefined ? current : match;
      });
    }
    
    if (Array.isArray(config)) {
      return config.map(item => this.interpolateValues(item, contextData));
    }
    
    if (typeof config === 'object' && config !== null) {
      const result = {};
      for (const [key, value] of Object.entries(config)) {
        result[key] = this.interpolateValues(value, contextData);
      }
      return result;
    }
    
    return config;
  }

  // Topologically sort nodes based on edges
  getExecutionOrder() {
    const inDegree = new Map();
    const adjList = new Map();
    
    this.nodes.forEach(n => {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    });

    // Only consider 'flow' edges for execution order (ignore 'parameter' sub-node edges for main loop)
    // Actually, sub-nodes must execute before the main node. 
    // We can treat all source->target edges as dependencies.
    this.edges.forEach(edge => {
      if (adjList.has(edge.source) && inDegree.has(edge.target)) {
        adjList.get(edge.source).push(edge.target);
        inDegree.set(edge.target, inDegree.get(edge.target) + 1);
      }
    });

    const queue = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    const order = [];
    while (queue.length > 0) {
      const current = queue.shift();
      order.push(current);

      adjList.get(current).forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    if (order.length !== this.nodes.length) {
      throw new Error("Cycle detected in workflow graph");
    }

    return order;
  }

  // Main execution loop
  async execute() {
    this.status = 'RUNNING';
    try {
      const order = this.getExecutionOrder();

      for (const nodeId of order) {
        const node = this.nodeMap.get(nodeId);
        
        // Find inputs from parent nodes
        const parentEdges = this.edges.filter(e => e.target === nodeId);
        
        // Merge outputs of all parent flow nodes into a single input array
        let $input = parentEdges
          .filter(e => !e.targetHandle || e.targetHandle === 'in') // Main flow handles
          .map(e => this.env.get(e.source))
          .flat()
          .filter(Boolean);
        
        // If no parents, use initial payload
        if ($input.length === 0 && parentEdges.length === 0) {
          $input = [this.env.get('initial')];
        }

        // Gather sub-node (parameter) inputs
        const subNodeData = {};
        parentEdges
          .filter(e => e.targetHandle && e.targetHandle !== 'in')
          .forEach(e => {
            subNodeData[e.targetHandle] = this.env.get(e.source);
          });

        // Interpolate config
        const contextData = { json: $input[0] || {}, env: process.env };
        const config = this.interpolateValues(node.data?.config || {}, contextData);

        this.log(nodeId, `Executing node: ${node.data.label}`, { type: node.data.type, config });

        // Execute specific logic based on node type
        let result = null;
        try {
           result = await this.executeNodeLogic(node.data.type, $input, config, subNodeData);
        } catch (err) {
           this.log(nodeId, `Node Execution Error: ${err.message}`, err.stack);
           throw err;
        }

        // Store result
        this.env.set(nodeId, result);
        this.log(nodeId, `Node completed`, result);
      }
      
      this.status = 'SUCCESS';
      return { status: this.status, logs: this.logs, env: Object.fromEntries(this.env) };
    } catch (error) {
      this.status = 'ERROR';
      this.log('system', `Workflow failed: ${error.message}`, error.stack);
      return { status: this.status, logs: this.logs, error: error.message };
    }
  }

  // Node specific handlers
  async executeNodeLogic(type, $input, config, subNodeData) {
    // Array wrappers to handle batching
    const items = $input.length > 0 ? $input : [{}];
    const results = [];

    // =============================
    // TRIGGERS (Pass-through mostly)
    // =============================
    if (type === 'webhook' || type === 'schedule' || type === 'manual_trigger') {
      return items; 
    }

    // =============================
    // DATA TRANSFORMATION
    // =============================
    if (type === 'set') {
      for (const item of items) {
        const out = config.mode === 'Keep Only Set Fields' ? {} : { ...item };
        if (config.field_name) {
          out[config.field_name] = config.field_value;
        }
        results.push(out);
      }
      return results;
    }

    if (type === 'code') {
      // Very basic simulation for JS code execution. In prod, use vm2 or isolated-vm.
      try {
        const fn = new Function('$input', 'config', config.code || 'return $input;');
        return fn(items, config);
      } catch (err) {
        throw new Error(`Code execution failed: ${err.message}`);
      }
    }

    // =============================
    // INTEGRATIONS
    // =============================
    if (type === 'http_request') {
      for (const item of items) {
        const response = await fetch(config.url, {
          method: config.method || 'GET',
          headers: typeof config.headers === 'object' ? config.headers : {},
          body: config.method !== 'GET' && config.method !== 'HEAD' ? JSON.stringify(config.body) : undefined
        });
        
        const contentType = response.headers.get("content-type");
        const data = contentType && contentType.includes("application/json") ? await response.json() : await response.text();
        
        results.push({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data
        });
      }
      return results;
    }

    // =============================
    // AI & AGENTS
    // =============================
    if (type === 'openai_model') {
       // Just returns config so Agent node can use it
       return { provider: 'openai', model: config.model_name, temperature: config.temperature, key: config.credential };
    }

    if (type === 'buffer_memory') {
       return { type: 'window', size: config.window_size, session_id: config.session_id };
    }

    if (type === 'agent') {
       const modelConfig = subNodeData['model']?.[0] || { provider: 'mock' };
       const memoryConfig = subNodeData['memory']?.[0] || { type: 'none' };
       
       for (const item of items) {
          // Simulation of AI Agent call
          results.push({
             system: config.system_message,
             model_used: modelConfig.model,
             memory_used: memoryConfig.type,
             input: item,
             response: "Simulated AI Response from FlowCraft Agent"
          });
       }
       return results;
    }

    // Default fallback
    return items;
  }
}
