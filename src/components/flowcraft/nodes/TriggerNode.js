"use client";

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ data, isConnectable }) => {
  return (
    <div className="bg-[#222] border border-yellow-500 rounded shadow-md w-64">
      <div className="bg-yellow-500 text-black font-bold p-2 text-sm rounded-t flex items-center gap-2">
        <i className="fas fa-bolt"></i> {data.label || 'Trigger'}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <label className="text-xs text-zinc-400 font-bold">Event</label>
        <select className="bg-[#111] text-white text-xs border border-[#333] rounded p-1">
          <option>Webhook Request</option>
          <option>Schedule (Cron)</option>
          <option>Manual Execution</option>
        </select>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: '#eab308' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
