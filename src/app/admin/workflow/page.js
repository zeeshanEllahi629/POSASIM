"use client";
import React from 'react';
import { NodeSidebar } from '@/components/workflow/NodeSidebar';
import { CanvasArea } from '@/components/workflow/CanvasArea';
import { Bot, Play, Save, Code, Server } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWorkflowStore } from '@/store/workflowStore';
import { WorkflowEngine } from '@/lib/workflow/executionEngine';

export default function WorkflowDesignerPage() {
  const { nodes, edges, workflowId } = useWorkflowStore();

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
    toast.success('Workflow exported successfully!');
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed/workflow" width="100%" height="800" style="border:none; border-radius:12px;"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  const handleDeploy = async () => {
    if (nodes.length === 0) {
      toast.error("Canvas is empty. Add nodes to deploy.");
      return;
    }
    const loadingToast = toast.loading("Deploying workflow...");
    try {
      const res = await fetch('/api/workflow/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: workflowId, nodes, edges })
      });
      const data = await res.json();
      if (data.status === 1) {
        toast.success("Workflow deployed successfully! Webhooks are now active.", { id: loadingToast });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error("Deployment failed: " + error.message, { id: loadingToast });
    }
  };

  const handleExecute = async () => {
    if (nodes.length === 0) {
      toast.error("Canvas is empty. Add nodes to execute.");
      return;
    }
    toast.success("Workflow execution started...");
    
    const engine = new WorkflowEngine(nodes, edges);
    const result = await engine.execute();
    if (result && result.success) {
      toast.success("Workflow executed successfully!");
    } else {
      toast.error(result?.error || "Execution failed");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full bg-[#050505] text-white overflow-hidden rounded-xl border border-[#222]">
      {/* Top Navbar */}
      <div className="h-14 border-b border-[#222] bg-[#0a0a0f] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#6366f1] to-[#a855f7] p-1.5 rounded-lg">
            <Bot size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Visual Workflow Designer
          </h1>
          <span className="ml-4 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#222] text-[#6366f1] border border-[#333]">
            BETA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyEmbed}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-[#222] transition-colors border border-transparent hover:border-[#333]"
          >
            <Code size={16} />
            Get Embed Code
          </button>

          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-[#222] transition-colors border border-transparent hover:border-[#333]"
          >
            <Save size={16} />
            Export JSON
          </button>
          
          <button 
            onClick={handleDeploy}
            className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-bold text-white bg-[#6366f1] hover:bg-[#4f46e5] transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <Server size={16} />
            Deploy (Save)
          </button>
          
          <button 
            onClick={handleExecute}
            className="flex items-center gap-2 px-5 py-1.5 rounded-md text-sm font-bold text-white bg-[#00e676] hover:bg-[#00c853] transition-colors shadow-[0_0_15px_rgba(0,230,118,0.3)]"
          >
            <Play size={16} className="fill-current" />
            Run Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <NodeSidebar />
        <CanvasArea />
      </div>
    </div>
  );
}
