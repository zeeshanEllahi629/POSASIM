import type { Edge } from '@xyflow/react';
import type { WorkflowNode } from '@/store/workflowStore';
import prisma from '@/lib/prisma';

// Note: Ensure this file has NO browser-only dependencies (like react-hot-toast) 
// so it can run in Next.js API routes.

export class WorkflowEngine {
  nodes: WorkflowNode[];
  edges: Edge[];

  constructor(nodes: WorkflowNode[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  // Find nodes with no incoming edges (triggers)
  getStartingNodes(): WorkflowNode[] {
    const inDegree: Record<string, number> = {};
    this.nodes.forEach(n => inDegree[n.id] = 0);
    this.edges.forEach(e => {
      if (inDegree[e.target] !== undefined) {
        inDegree[e.target] += 1;
      }
    });
    return this.nodes.filter(n => inDegree[n.id] === 0);
  }

  // Replace variables like {{payload.key}} with actual values
  replaceVars(str: string, payload: any): string {
    if (!str) return '';
    return str.replace(/\{\{payload\.([^}]+)\}\}/g, (match: string, p1: string) => {
       const keys = p1.split('.');
       let val = payload;
       for (const key of keys) {
         if (val === undefined || val === null) break;
         val = val[key];
       }
       return val !== undefined ? String(val) : match;
    });
  }

  async execute(workflowId: string = "manual_run", initialPayload: any = { initial: true }) {
    let currentNodes = this.getStartingNodes();
    
    if (currentNodes.length === 0) {
      return { success: false, error: "No trigger node found or cycle detected" };
    }

    let payload: any = initialPayload;
    const executed = new Set<string>();
    const sessionId = `session_${Date.now()}`;

    while (currentNodes.length > 0) {
      const nextNodes: WorkflowNode[] = [];

      for (const node of currentNodes) {
        if (executed.has(node.id)) continue;
        executed.add(node.id);

        console.log(`Executing node: ${node.data.label} (${node.data.type})`);
        let actionStatus = 'success';
        let actionPayload = '';
        let attempts = 0;
        const maxAttempts = node.data.retryOnFail ? 3 : 1;
        let success = false;
        let lastError = null;

        while (attempts < maxAttempts && !success) {
          attempts++;
          try {
          // ============================================
          // 1. DATA PROCESSING NODES
          // ============================================
          if (node.type === 'httpRequest') {
            const method = node.data.httpMethod || 'GET';
            const url = this.replaceVars(node.data.httpUrl, payload);
            if (!url) throw new Error("HTTP URL is missing");

            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (node.data.advancedParams) {
              node.data.advancedParams.forEach((p: any) => {
                if (p.key && p.value) headers[p.key] = this.replaceVars(p.value, payload);
              });
            }

            const fetchOptions: RequestInit = { method, headers };
            if (['POST', 'PUT', 'PATCH'].includes(method) && node.data.httpBody) {
              fetchOptions.body = this.replaceVars(node.data.httpBody, payload);
            }

            console.log(`[HTTP Request] ${method} ${url}`);
            const response = await fetch(url, fetchOptions);
            const responseData = await response.json().catch(() => ({}));
            payload = { ...payload, [node.id]: responseData, lastHttpResponse: responseData };

          } else if (node.type === 'jsonParser') {
            console.log(`[JSON Parser] Parsing data`);
            // Mock parsing logic
            payload = { ...payload, parsedJson: { status: "success", timestamp: Date.now() } };

          } else if (node.type === 'databaseQuery') {
            console.log(`[Database Query] Executing query`);
            await new Promise(res => setTimeout(res, 500));
            payload = { ...payload, dbResult: [{ id: 1, name: "Test" }] };

          } else if (node.type === 'dataTransform') {
            console.log(`[Data Transform] Transforming data`);
            payload = { ...payload, transformedData: true };

          // ============================================
          // 2. COMMUNICATION NODES
          // ============================================
          } else if (node.type === 'sendEmail') {
            const to = this.replaceVars(node.data.emailTo, payload);
            const subject = this.replaceVars(node.data.emailSubject, payload);
            const bodyStr = this.replaceVars(node.data.emailBody, payload);
            console.log(`[EMAIL SEND] To: ${to} | Subject: ${subject}`);
            await new Promise(res => setTimeout(res, 800));
            payload = { ...payload, [node.id]: { status: 'sent', to } };

          } else if (node.type === 'sendSMS') {
            console.log(`[SMS SEND] Sending SMS`);
            await new Promise(res => setTimeout(res, 500));
            payload = { ...payload, smsStatus: 'sent' };

          } else if (node.type === 'slackMessage') {
            console.log(`[SLACK] Sending Slack message`);
            await new Promise(res => setTimeout(res, 300));
            payload = { ...payload, slackStatus: 'delivered' };

          } else if (node.type === 'pushNotification') {
            console.log(`[PUSH] Sending Push notification`);
            await new Promise(res => setTimeout(res, 200));

          // ============================================
          // 3. LOGIC NODES (Condition, Switch, Delay)
          // ============================================
          } else if (node.type === 'condition') {
            console.log(`[CONDITION] Evaluating condition`);
            // Mock condition: 50% chance true or false
            payload.conditionResult = Math.random() > 0.5;
            console.log(`Condition result: ${payload.conditionResult}`);

          } else if (node.type === 'switch') {
            console.log(`[SWITCH] Evaluating switch`);
            payload.switchOutput = Math.floor(Math.random() * 4) + 1; // 1, 2, 3, 4

          } else if (node.type === 'delay') {
            console.log(`[DELAY] Waiting...`);
            await new Promise(res => setTimeout(res, 1000));

          // ============================================
          // 4. APP INTEGRATIONS
          // ============================================
          } else if (node.type === 'telegramApp') {
            console.log(`[APP] Executing Telegram API`);
            const botToken = this.replaceVars(node.data.botToken || '', payload);
            const chatId = this.replaceVars(node.data.chatId || '', payload);
            const message = this.replaceVars(node.data.message || '', payload);
            
            if (botToken && chatId && message) {
              const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
              const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.description || "Telegram API Error");
              payload = { ...payload, telegram: data };
            } else {
              throw new Error("Missing Telegram Bot Token, Chat ID or Message");
            }

          } else if (node.type === 'discordApp') {
            console.log(`[APP] Executing Discord Webhook`);
            const webhookUrl = this.replaceVars(node.data.webhookUrl || '', payload);
            const content = this.replaceVars(node.data.content || '', payload);
            if (webhookUrl && content) {
              const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
              });
              if (!res.ok) throw new Error("Discord API Error");
              payload = { ...payload, discord: { status: 'delivered' } };
            } else {
              throw new Error("Missing Discord Webhook URL or Content");
            }

          } else if (node.type === 'aiBrain') {
            console.log(`[APP] Executing AI Brain API`);
            const baseUrl = this.replaceVars(node.data.llmBaseUrl || 'https://api.openai.com/v1', payload);
            const apiKey = this.replaceVars(node.data.apiKey || '', payload);
            const model = this.replaceVars(node.data.modelName || 'gpt-3.5-turbo', payload);
            const sysPrompt = this.replaceVars(node.data.systemPrompt || '', payload);
            const userPrompt = this.replaceVars(node.data.userPrompt || '', payload);

            if (!apiKey) throw new Error("AI Brain API Key is missing");

            const messages = [];
            if (sysPrompt) messages.push({ role: "system", content: sysPrompt });
            if (userPrompt) messages.push({ role: "user", content: userPrompt });
            else messages.push({ role: "user", content: JSON.stringify(payload) }); // Default to sending payload

            const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
            const res = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                model: model,
                messages: messages
              })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || "AI API Error");
            
            payload = { ...payload, aiBrain: data, aiResponse: data.choices?.[0]?.message?.content };

          } else if (node.type === 'shopifyApp') {
            console.log(`[APP] Executing Shopify API`);
            await new Promise(res => setTimeout(res, 600));
            payload = { ...payload, shopify: { action: 'success', data: { id: 12345 } } };

          // ============================================
          // 5. AI MODELS (Legacy/Custom)
          // ============================================
          } else if (['customChat', 'customLLM', 'embeddingGenerator', 'sentimentAnalysis'].includes(node.type)) {
            console.log(`[AI MODEL] Executing ${node.type}`);
            if (node.data.llmEndpoint) {
               console.log(`Calling LLM endpoint: ${node.data.llmEndpoint}`);
            }
            await new Promise(res => setTimeout(res, 1000));
            payload = { ...payload, aiResponse: `Mock response from ${node.type}` };

          // ============================================
          // 6. CUSTOM CODE
          // ============================================
          } else if (node.type === 'customCode' && node.data.customCode) {
            console.log(`[CUSTOM CODE] Executing JS snippet`);
            const fn = new Function('data', node.data.customCode);
            payload = await fn(payload);

          // ============================================
          // 7. TRIGGERS
          // ============================================
          } else if (['webhookTrigger', 'scheduleTrigger', 'manualTrigger'].includes(node.type)) {
            console.log(`[TRIGGER] Started via ${node.type}`);
            payload = { ...payload, trigger: node.type };
          } else {
            // Default fast pass-through for unknown nodes
            await new Promise(res => setTimeout(res, 100));
          }

          // If AI Node, save to memory
          if (node.data.category === 'AI Models' || node.type === 'openaiApp') {
            await prisma.ai_chat_memory.create({
               data: {
                 session_id: sessionId,
                 role: 'assistant',
                 content: JSON.stringify(payload),
               }
            });
          }
          actionPayload = JSON.stringify(payload);
          success = true;

        } catch (e: any) {
          lastError = e;
          if (attempts < maxAttempts) {
             console.log(`Attempt ${attempts} failed for node ${node.data.label}. Retrying...`);
             await new Promise(r => setTimeout(r, 1000)); // wait 1s before retry
          }
        }
      } // End retry while loop

      if (!success) {
         console.error(`Error in node ${node.id} after ${attempts} attempts:`, lastError);
         actionStatus = 'failed';
         actionPayload = lastError?.message || 'Unknown error';
         
         // Check Continue on Fail
         if (!node.data.continueOnFail) {
            // Log the failure to DB before aborting
            try {
               await prisma.ai_agent_logs.create({
                 data: { workflow_id: workflowId, node_name: node.data.label || node.type, action: node.type, payload: actionPayload.substring(0, 5000), status: actionStatus }
               });
            } catch(dbErr) {}
            return { success: false, error: `Execution failed at node: ${node.data.label}`, details: lastError?.message };
         } else {
            console.log(`Continuing execution despite failure (Continue on Fail enabled)`);
            payload = { ...payload, [`${node.id}_error`]: lastError?.message };
         }
      }

      // Finally block equivalent for logging
      try {
         await prisma.ai_agent_logs.create({
           data: {
             workflow_id: workflowId,
             node_name: node.data.label || node.type,
             action: node.type,
             payload: actionPayload.substring(0, 5000),
             status: actionStatus
           }
         });
      } catch(dbErr) {
         console.error("Failed to save agent log", dbErr);
      }

        // --- DETERMINE NEXT NODES ---
        let outgoingEdges = this.edges.filter(e => e.source === node.id);

        if (node.type === 'condition') {
          const route = payload.conditionResult ? 'true' : 'false';
          // Filter only if edges have handles defined (for future proofing)
          if (outgoingEdges.some(e => e.sourceHandle)) {
            outgoingEdges = outgoingEdges.filter(e => e.sourceHandle === route);
          }
        } else if (node.type === 'switch') {
          const route = `output-${payload.switchOutput}`;
          if (outgoingEdges.some(e => e.sourceHandle)) {
            outgoingEdges = outgoingEdges.filter(e => e.sourceHandle === route);
          }
        }

        for (const edge of outgoingEdges) {
          const targetNode = this.nodes.find(n => n.id === edge.target);
          if (targetNode && !executed.has(targetNode.id)) {
            nextNodes.push(targetNode);
          }
        }
      }

      currentNodes = nextNodes;
    }

    console.log("Final Output Payload:", payload);
    return { success: true, payload };
  }
}
