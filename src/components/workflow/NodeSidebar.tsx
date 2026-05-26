import React, { useState } from 'react';
import { NodeDefinitions, NodeCategories } from '@/lib/workflow/nodeDefinitions';
import { Search, ChevronDown, ChevronRight, Menu } from 'lucide-react';

export const NodeSidebar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.values(NodeCategories).reduce((acc, cat) => ({ ...acc, [cat]: true }), {})
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', 'customNode');
    event.dataTransfer.setData('application/nodeData', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const filteredNodes = NodeDefinitions.filter(node => 
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nodesByCategory = Object.values(NodeCategories).reduce((acc, category) => {
    acc[category] = filteredNodes.filter(node => node.category === category);
    return acc;
  }, {} as Record<string, typeof NodeDefinitions>);

  return (
    <div className="w-80 h-full bg-[#0d0d16] border-r border-[#222] flex flex-col">
      <div className="p-4 border-b border-[#222]">
        <div className="flex items-center gap-2 mb-4 text-[#00e676]">
          <Menu size={20} />
          <h2 className="font-bold text-lg">Nodes</h2>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search nodes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
        {Object.entries(nodesByCategory).map(([category, nodes]) => {
          if (nodes.length === 0) return null;
          
          const isExpanded = expandedCategories[category];
          
          return (
            <div key={category} className="mb-2">
              <button 
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-2 text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-xs font-bold uppercase tracking-wider">{category}</span>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {isExpanded && (
                <div className="space-y-1 mt-1">
                  {nodes.map(node => (
                    <div
                      key={node.type}
                      className="group flex items-center p-3 rounded-lg border border-[#222] bg-[#151525] hover:bg-[#1a1a2e] hover:border-[#6366f1] cursor-grab active:cursor-grabbing transition-all"
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type, node)}
                    >
                      <div className={`w-3 h-3 rounded-full mr-3 ${node.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-200 group-hover:text-white">{node.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
