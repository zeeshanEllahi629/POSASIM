import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { WorkflowNodeData } from '@/store/workflowStore';
import { Settings, Play, Database, MessageSquare, Code, Zap } from 'lucide-react';

export const CustomNode = memo(({ data, selected }: NodeProps<WorkflowNodeData>) => {
  const isAI = data.category === 'AI Models';
  const isCode = data.category === 'Custom';
  const isTrigger = data.category === 'Triggers';
  const isData = data.category === 'Data Processing';

  let Icon = Zap;
  if (isAI) Icon = MessageSquare;
  if (isCode) Icon = Code;
  if (isData) Icon = Database;
  if (isTrigger) Icon = Play;

  // Derive color classes based on category
  let headerBg = 'bg-blue-600';
  if (isAI) headerBg = 'bg-purple-600';
  if (isCode) headerBg = 'bg-red-600';
  if (isData) headerBg = 'bg-yellow-600';
  if (data.category === 'Communication') headerBg = 'bg-green-600';
  if (data.category === 'Logic') headerBg = 'bg-orange-600';

  return (
    <div className={`w-64 rounded-xl overflow-hidden bg-[#1a1a2e] border-2 transition-colors ${selected ? 'border-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-[#333]'}`}>
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-[#6366f1] border-2 border-[#1a1a2e]"
        />
      )}
      
      <div className={`${headerBg} px-3 py-2 flex items-center justify-between text-white`}>
        <div className="flex items-center gap-2">
          <Icon size={16} />
          <span className="font-bold text-xs uppercase tracking-wider">{data.label}</span>
        </div>
        <button className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/20">
          <Settings size={14} />
        </button>
      </div>
      
      <div className="p-3 text-sm text-gray-300">
        <p className="line-clamp-2 text-xs text-gray-400">
          {data.description || 'Configure this node properties.'}
        </p>
        
        {isCode && data.customCode && (
          <div className="mt-2 bg-[#111] border border-[#333] rounded px-2 py-1 text-[10px] font-mono text-[#00e676] truncate">
            {data.customCode}
          </div>
        )}
        
        {isAI && data.customPrompt && (
          <div className="mt-2 bg-[#111] border border-[#333] rounded px-2 py-1 text-[10px] italic text-[#a78bfa] truncate">
            "{data.customPrompt}"
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-[#6366f1] border-2 border-[#1a1a2e]"
      />
    </div>
  );
});

import { StickyNoteNode } from './StickyNoteNode';

export const nodeTypes = {
  customNode: CustomNode,
  stickyNote: StickyNoteNode,
};
