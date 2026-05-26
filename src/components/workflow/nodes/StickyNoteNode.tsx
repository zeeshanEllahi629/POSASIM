import React, { memo, useState } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { useWorkflowStore, WorkflowNodeData } from '@/store/workflowStore';

export const StickyNoteNode = memo(({ id, data, selected }: NodeProps<WorkflowNodeData>) => {
  const { updateNodeData } = useWorkflowStore();
  
  // Default values
  const text = data.description || '';
  const bgColor = data.customPrompt || '#fef08a'; // We reuse customPrompt as color for now, or add a proper field
  
  const [localText, setLocalText] = useState(text);

  const colors = ['#fef08a', '#bfdbfe', '#bbf7d0', '#fbcfe8', '#fed7aa']; // Yellow, Blue, Green, Pink, Orange

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  };

  const handleBlur = () => {
    updateNodeData(id, { ...data, description: localText });
  };

  const changeColor = (c: string) => {
    updateNodeData(id, { ...data, customPrompt: c });
  };

  return (
    <>
      <NodeResizer 
        color="#6366f1" 
        isVisible={selected} 
        minWidth={150} 
        minHeight={150} 
      />
      <div 
        className="w-full h-full shadow-lg rounded-sm flex flex-col transition-shadow"
        style={{ 
          backgroundColor: bgColor,
          boxShadow: selected ? '0 0 0 2px #6366f1, 0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Drag handle area & color picker (only visible on hover/select) */}
        <div className="h-6 flex items-center justify-between px-2 opacity-0 hover:opacity-100 transition-opacity bg-black/10">
          <div className="flex gap-1">
            {colors.map(c => (
              <button 
                key={c}
                onClick={() => changeColor(c)}
                className="w-3 h-3 rounded-full border border-black/20 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                title="Change Color"
              />
            ))}
          </div>
          <i className="fas fa-grip-horizontal text-black/40 text-xs"></i>
        </div>

        <textarea
          value={localText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          placeholder="Type your note here..."
          className="flex-1 w-full bg-transparent p-3 outline-none resize-none text-black font-medium placeholder-black/40"
          style={{ minHeight: '100px' }}
        />
      </div>
    </>
  );
});
