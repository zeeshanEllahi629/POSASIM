"use client";

import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import AiBrainNode from './nodes/AiBrainNode';
import GoogleNode from './nodes/GoogleNode';

const nodeTypes = {
  trigger: TriggerNode,
  aiBrain: AiBrainNode,
  google: GoogleNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    data: { label: 'Webhook Trigger' },
    position: { x: 250, y: 150 },
  },
];

let id = 10;
const getId = () => `dndnode_${id++}`;

export default function FlowCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a]">
      {/* Left Sidebar (Node Palette) */}
      <div className="w-64 bg-[#111] border-r border-[#222] p-4 text-white flex flex-col gap-4 z-10">
        <h3 className="font-bold border-b border-[#333] pb-2 text-red-500">Nodes</h3>
        
        <div 
          className="p-3 bg-[#222] border border-[#333] rounded cursor-grab hover:border-red-500 transition-colors"
          onDragStart={(e) => {
            e.dataTransfer.setData('application/reactflow', 'trigger');
            e.dataTransfer.effectAllowed = 'move';
          }}
          draggable
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-bolt text-yellow-500"></i> Trigger Node
          </div>
        </div>

        <div 
          className="p-3 bg-[#222] border border-[#333] rounded cursor-grab hover:border-red-500 transition-colors"
          onDragStart={(e) => {
            e.dataTransfer.setData('application/reactflow', 'aiBrain');
            e.dataTransfer.effectAllowed = 'move';
          }}
          draggable
        >
          <div className="flex items-center gap-2">
            <i className="fas fa-brain text-purple-500"></i> AI Brain Node
          </div>
        </div>

        <div 
          className="p-3 bg-[#222] border border-[#333] rounded cursor-grab hover:border-red-500 transition-colors"
          onDragStart={(e) => {
            e.dataTransfer.setData('application/reactflow', 'google');
            e.dataTransfer.effectAllowed = 'move';
          }}
          draggable
        >
          <div className="flex items-center gap-2">
            <i className="fab fa-google text-blue-500"></i> Google Node
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0a0a0a]"
          >
            <Background color="#333" gap={16} />
            <Controls className="bg-[#222] border-[#333] fill-white" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.type === 'trigger') return '#eab308';
                if (n.type === 'aiBrain') return '#a855f7';
                if (n.type === 'google') return '#3b82f6';
                return '#444';
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              className="bg-[#111] border border-[#222]"
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Right Sidebar (Data Mapping & Context) */}
      <div className="w-80 bg-[#111] border-l border-[#222] p-4 text-white overflow-y-auto z-10">
        <h3 className="font-bold border-b border-[#333] pb-2 text-red-500">Data Mapping Context</h3>
        <p className="text-xs text-zinc-400 mt-2 mb-4">
          Data from previous connected nodes. Drag keys into the current node's inputs.
        </p>
        
        {/* Placeholder for now. We will implement dynamic mapping based on selected node connections */}
        <div className="bg-[#222] rounded p-3 text-sm border border-[#333]">
          <h4 className="font-bold text-zinc-300 mb-2">Previous Node: <span className="text-yellow-500">Trigger</span></h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-[#1a1a1a] p-2 rounded cursor-grab hover:bg-[#333]" draggable>
              <span className="font-mono text-blue-400">payload.email</span>
              <i className="fas fa-grip-vertical text-zinc-500"></i>
            </div>
            <div className="flex justify-between items-center bg-[#1a1a1a] p-2 rounded cursor-grab hover:bg-[#333]" draggable>
              <span className="font-mono text-blue-400">payload.name</span>
              <i className="fas fa-grip-vertical text-zinc-500"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
