"use client";

import React, { useState } from 'react';
import { CanvasArea } from '@/components/workflow/CanvasArea';
import { NodeSidebar } from '@/components/workflow/NodeSidebar';

export default function EmbedWorkflowPage() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] overflow-hidden text-white font-sans">
      {/* Embedded Header */}
      <div className="h-12 bg-[#111] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-bars"></i>
          </button>
          <span className="font-bold text-sm tracking-widest text-[#00e676]">foodefy<span className="text-white">flow</span></span>
        </div>
        <div>
          <span className="text-xs text-gray-500 bg-[#222] px-2 py-1 rounded">Embedded Mode</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && <NodeSidebar />}
        <CanvasArea />
      </div>
    </div>
  );
}
