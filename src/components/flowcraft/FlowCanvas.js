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

import DynamicNode from './nodes/DynamicNode';
import { NodeRegistry, NodeCategories } from './registry/NodeRegistry';

const nodeTypes = {
  dynamicNode: DynamicNode,
};

let id = 10;
const getId = () => `node_${id++}`;

export default function FlowCanvas() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Track selected node for the inspector
  const [selectedNodeId, setSelectedNodeId] = useState(null);

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
      
      const config = NodeRegistry[type];

      const newNode = {
        id: getId(),
        type: 'dynamicNode',
        position,
        data: { 
          type, // the registry key
          label: config.name,
          config: {} // to store user configured values
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onSelectionChange = useCallback(({ nodes }) => {
    if (nodes.length === 1) {
      setSelectedNodeId(nodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedConfig = selectedNode ? NodeRegistry[selectedNode.data.type] : null;

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden select-none">
      
      {/* Left Sidebar (Node Palette) */}
      <div className="w-64 bg-[#111] border-r border-[#222] text-white flex flex-col z-10 h-full overflow-y-auto scrollbar-thin">
        <div className="p-4 border-b border-[#222] sticky top-0 bg-[#111] z-20">
          <h3 className="font-bold text-red-500">Nodes Palette</h3>
          <p className="text-xs text-zinc-500 mt-1">Drag and drop to canvas</p>
        </div>
        
        <div className="p-2 flex flex-col gap-4">
          {NodeCategories.map(category => {
            const categoryNodes = Object.values(NodeRegistry).filter(n => n.category === category.id);
            if (categoryNodes.length === 0) return null;

            return (
              <div key={category.id} className="mb-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                  <i className={`fas ${category.icon}`} style={{ color: category.color }}></i>
                  {category.label}
                </h4>
                <div className="flex flex-col gap-1">
                  {categoryNodes.map(node => (
                    <div 
                      key={node.id}
                      className="p-2 bg-[#1a1a1a] border border-[#222] rounded hover:border-[#444] cursor-grab transition-all flex items-center gap-3 group"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/reactflow', node.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      draggable
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-[10px]"
                        style={{ backgroundColor: node.uiSettings.color, color: 'white' }}
                      >
                        <i className={`fas ${node.uiSettings.icon}`}></i>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">{node.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            className="bg-[#0a0a0a]"
          >
            <Background color="#333" gap={16} />
            <Controls className="bg-[#222] border-[#333] fill-white" />
            <MiniMap 
              nodeColor={(n) => {
                if (n.type === 'dynamicNode' && n.data?.type) {
                  return NodeRegistry[n.data.type]?.uiSettings?.color || '#444';
                }
                return '#444';
              }}
              maskColor="rgba(0, 0, 0, 0.7)"
              className="bg-[#111] border border-[#222]"
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {/* Right Sidebar (Node Inspector & Data) */}
      <div className="w-80 bg-[#111] border-l border-[#222] text-white flex flex-col z-10 h-full">
        {selectedNode && selectedConfig ? (
          <>
            <div className="p-4 border-b border-[#222] flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: selectedConfig.uiSettings.color }}
              >
                <i className={`fas ${selectedConfig.uiSettings.icon}`}></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">{selectedConfig.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">{selectedConfig.category}</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <p className="text-xs text-zinc-400 mb-6">{selectedConfig.description}</p>
              
              {/* Node Parameters */}
              {selectedConfig.parameters?.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h4 className="text-xs font-bold text-zinc-300 border-b border-[#333] pb-2">Parameters</h4>
                  {selectedConfig.parameters.map(param => (
                    <div key={param.id} className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-zinc-400">{param.label}</label>
                      
                      {param.type === 'select' && (
                        <select className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500 text-white">
                          {param.options?.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      )}

                      {param.type === 'text' && (
                        <input type="text" placeholder={param.default || ""} className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500 text-white" />
                      )}

                      {param.type === 'boolean' && (
                        <input type="checkbox" className="w-4 h-4 bg-[#1a1a1a]" defaultChecked={param.default} />
                      )}

                      {(param.type === 'json' || param.type === 'code') && (
                        <textarea rows="4" className="bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-red-500 text-white custom-scrollbar" defaultValue={param.default}></textarea>
                      )}

                      {param.type === 'credential' && (
                        <div className="flex gap-2">
                           <select className="flex-1 bg-[#1a1a1a] border border-[#333] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500 text-white">
                             <option value="">Select Credential</option>
                           </select>
                           <button className="bg-[#222] hover:bg-[#333] border border-[#333] rounded px-2 py-1 flex items-center justify-center text-xs" title="Add Credential">
                             <i className="fas fa-plus"></i>
                           </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Data Panel Simulation (Input/Output split like Flowise/Langchain) */}
              <div className="space-y-4">
                 <div className="flex border-b border-[#333] gap-4">
                    <button className="text-xs font-bold text-red-500 border-b-2 border-red-500 pb-1">INPUT</button>
                    <button className="text-xs font-bold text-zinc-500 pb-1 hover:text-zinc-300">OUTPUT</button>
                 </div>
                 <div className="bg-[#1a1a1a] border border-[#333] rounded p-2 text-xs font-mono text-zinc-400 min-h-[100px]">
                    Waiting for execution...
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
             <i className="fas fa-mouse-pointer text-3xl mb-4 opacity-50"></i>
             <p className="text-sm font-semibold">No node selected</p>
             <p className="text-xs mt-1">Select a node on the canvas to configure its properties and view execution data.</p>
          </div>
        )}
      </div>

    </div>
  );
}
