import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeRegistry } from '../registry/NodeRegistry';

export default function DynamicNode({ data, selected }) {
  const nodeType = data.type; // e.g. "webhook", "agent", "openai_model"
  const config = NodeRegistry[nodeType];

  if (!config) {
    return (
      <div className="bg-red-900 border border-red-500 rounded p-4 text-white text-xs">
        Unknown node type: {nodeType}
      </div>
    );
  }

  const { name, uiSettings, inputs, outputs } = config;
  const isSubnode = uiSettings.variant === 'subnode';
  const bgColor = isSubnode ? '#1e293b' : '#0f172a'; // darker for subnodes
  const borderColor = selected ? uiSettings.color : '#334155';

  return (
    <div
      className={`rounded-xl shadow-lg relative min-w-[220px] transition-all`}
      style={{
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: selected ? `0 0 10px ${uiSettings.color}40` : 'none',
      }}
    >
      {/* HEADER */}
      <div 
        className="flex items-center gap-3 p-3 rounded-t-lg border-b border-[#334155]"
        style={{ backgroundColor: `${uiSettings.color}15` }}
      >
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: uiSettings.color }}
        >
          <i className={`fas ${uiSettings.icon}`}></i>
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm text-white">{name}</div>
          {data.label && <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[150px]">{data.label}</div>}
        </div>
      </div>

      {/* BODY / CONFIG PREVIEW */}
      {/* We don't render all inputs here, just a preview. The full config is in the right sidebar */}
      {!isSubnode && (
        <div className="p-3 bg-[#0f172a]/50 text-xs text-gray-400 border-b border-[#334155]">
           <span className="opacity-70">Configuration via Node Inspector</span>
        </div>
      )}

      {/* FLOW HANDLES (Left / Right) */}
      {inputs?.map((input, idx) => (
        input.type === 'flow' && (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={input.id}
            className="w-3 h-3 bg-gray-400 border-2 border-[#0f172a]"
            style={{ top: `${(idx + 1) * 30 + 30}px` }}
          />
        )
      ))}

      {outputs?.map((output, idx) => (
        output.type === 'flow' && (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={output.id}
            className="w-3 h-3 bg-green-500 border-2 border-[#0f172a]"
            style={{ top: `${(idx + 1) * 30 + 30}px` }}
          />
        )
      ))}

      {/* PARAMETER HANDLES (Bottom / Top) for Sub-nodes */}
      <div className="flex justify-around px-2 py-2 w-full absolute -bottom-4 left-0">
        {inputs?.filter(i => i.position === 'bottom').map((input) => (
          <div key={input.id} className="relative group flex flex-col items-center">
            <Handle
              type="target"
              position={Position.Bottom}
              id={input.id}
              className={`w-3 h-3 ${input.id === 'model' ? 'bg-purple-500' : 'bg-blue-500'} border-2 border-[#0f172a] rounded-full`}
              style={{ position: 'relative', transform: 'none', top: 0, left: 0 }}
            />
            <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-wider">{input.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-around px-2 py-2 w-full absolute -top-4 left-0">
        {outputs?.filter(o => o.position === 'top').map((output) => (
          <div key={output.id} className="relative group flex flex-col items-center">
            <span className="text-[9px] text-gray-400 mb-1 uppercase tracking-wider">{output.label}</span>
            <Handle
              type="source"
              position={Position.Top}
              id={output.id}
              className={`w-3 h-3 ${output.id === 'model_out' ? 'bg-purple-500' : 'bg-blue-500'} border-2 border-[#0f172a] rounded-full`}
              style={{ position: 'relative', transform: 'none', top: 0, left: 0 }}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
