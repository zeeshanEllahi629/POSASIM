import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '@/store/workflowStore';
import { nodeTypes } from './nodes/CustomNode';
import { ConfigModal } from './modals/ConfigModal';

const CanvasContent = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useWorkflowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const nodeDataStr = event.dataTransfer.getData('application/nodeData');
      
      if (typeof type === 'undefined' || !type || !nodeDataStr) {
        return;
      }

      const parsedData = JSON.parse(nodeDataStr);

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${parsedData.type}-${Date.now()}`,
        type,
        position,
        data: { ...parsedData },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    setActiveNodeId(node.id);
  }, []);

  return (
    <div className="flex-1 h-full relative bg-[#050505]" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow-dark"
        defaultEdgeOptions={{ 
          type: 'smoothstep', 
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 } 
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#333" />
        <Controls className="bg-[#1a1a2e] border-[#333] fill-white" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.data?.category === 'Triggers') return '#3b82f6';
            if (n.data?.category === 'AI Models') return '#9333ea';
            if (n.data?.category === 'Custom') return '#ef4444';
            return '#6366f1';
          }}
          maskColor="rgba(0,0,0,0.7)"
          className="bg-[#111]"
        />
      </ReactFlow>

      {activeNodeId && (
        <ConfigModal nodeId={activeNodeId} onClose={() => setActiveNodeId(null)} />
      )}
    </div>
  );
};

export const CanvasArea = () => {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
};
