"use client";

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, isConnectable }) => {
  return (
    <div className="bg-[#222] border border-purple-500 rounded shadow-md w-64">
      <Handle
        type="target"
        position={Position.Left}
        id="t"
        style={{ background: '#a855f7' }}
        isConnectable={isConnectable}
      />
      <div className="bg-purple-600 text-white font-bold p-2 text-sm rounded-t flex items-center gap-2">
        <i className="fas fa-brain"></i> {data.label || 'AI Brain'}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-1">System Prompt</label>
          <textarea 
            className="bg-[#111] w-full text-white text-xs border border-[#333] rounded p-1 resize-none h-16"
            placeholder="You are a helpful assistant..."
          ></textarea>
        </div>
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-1">User Prompt</label>
          <div className="bg-[#111] min-h-16 w-full text-white text-xs border border-[#333] border-dashed rounded p-1" onDrop={(e) => {
            // Logic to drop mapped data here
          }} onDragOver={(e) => e.preventDefault()}>
            <span className="text-zinc-600 italic">Drop data here...</span>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="s"
        style={{ background: '#a855f7' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
