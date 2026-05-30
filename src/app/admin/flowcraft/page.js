import React from 'react';
import FlowCanvas from '@/components/flowcraft/FlowCanvas';

export const metadata = {
  title: 'FlowCraft | Automation Engine',
};

export default function FlowCraftPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-[#0a0a0a] border-b border-[#222] p-4 flex justify-between items-center text-white z-20">
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-600">
            FlowCraft Engine
          </h1>
          <p className="text-xs text-zinc-500">Visual automation builder for your AI workflows.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#222] hover:bg-[#333] border border-[#333] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors">
            Test Workflow
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            Save Workflow
          </button>
        </div>
      </header>
      
      <main className="flex-1 relative">
        <FlowCanvas />
      </main>
    </div>
  );
}
