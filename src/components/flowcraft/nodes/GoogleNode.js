"use client";

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, isConnectable }) => {
  return (
    <div className="bg-[#222] border border-blue-500 rounded shadow-md w-64">
      <Handle
        type="target"
        position={Position.Left}
        id="t"
        style={{ background: '#3b82f6' }}
        isConnectable={isConnectable}
      />
      <div className="bg-blue-600 text-white font-bold p-2 text-sm rounded-t flex items-center gap-2">
        <i className="fab fa-google"></i> {data.label || 'Google Service'}
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-1">Service</label>
          <select className="bg-[#111] w-full text-white text-xs border border-[#333] rounded p-1">
            <option>Google Sheets</option>
            <option>Google Drive</option>
            <option>Google Calendar</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-1">Action</label>
          <select className="bg-[#111] w-full text-white text-xs border border-[#333] rounded p-1">
            <option>Append Row</option>
            <option>Read Row</option>
            <option>Update Row</option>
          </select>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="s"
        style={{ background: '#3b82f6' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
