import React, { useState, useEffect } from 'react';
import { useWorkflowStore, Credential } from '@/store/workflowStore';
import { X, Save, Key, Settings, Sliders, Plus, Trash2 } from 'lucide-react';

interface ConfigModalProps {
  nodeId: string | null;
  onClose: () => void;
}

export const ConfigModal = ({ nodeId, onClose }: ConfigModalProps) => {
  const { nodes, updateNodeData, credentials, addCredential, workflowId } = useWorkflowStore();
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'settings' | 'credentials' | 'advanced'>('settings');
  
  // Credentials UI State
  const [showNewCredForm, setShowNewCredForm] = useState(false);
  const [newCredName, setNewCredName] = useState('');
  const [newCredType, setNewCredType] = useState('api_key');
  const [newCredValue, setNewCredValue] = useState('');

  const node = nodes.find(n => n.id === nodeId);

  useEffect(() => {
    if (node) {
      setFormData({ 
        ...node.data,
        advancedParams: node.data.advancedParams || [] 
      });
    }
  }, [node]);

  if (!nodeId || !node) return null;

  const isAI = node.data.category === 'AI Models';
  const isCode = node.data.category === 'Custom';
  const isHttp = node.data.type === 'httpRequest';
  const isWebhook = node.data.type === 'webhookTrigger';
  const isEmail = node.data.type === 'sendEmail';
  const isTelegram = node.data.type === 'telegramApp';
  const isDiscord = node.data.type === 'discordApp';
  const isOpenAI = node.data.type === 'openaiApp';
  const isShopify = node.data.type === 'shopifyApp';

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateNodeData(nodeId, formData);
    onClose();
  };

  const handleCreateCredential = () => {
    if (!newCredName || !newCredValue) return;
    const cred: Credential = {
      id: `cred_${Date.now()}`,
      name: newCredName,
      type: newCredType,
      data: { key: newCredValue }
    };
    addCredential(cred);
    handleChange('credentialId', cred.id);
    setShowNewCredForm(false);
    setNewCredName('');
    setNewCredValue('');
  };

  const handleAddParam = () => {
    const currentParams = formData.advancedParams || [];
    handleChange('advancedParams', [...currentParams, { key: '', value: '' }]);
  };

  const handleUpdateParam = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...(formData.advancedParams || [])];
    updated[index][field] = val;
    handleChange('advancedParams', updated);
  };

  const handleRemoveParam = (index: number) => {
    const updated = [...(formData.advancedParams || [])];
    updated.splice(index, 1);
    handleChange('advancedParams', updated);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#111] border border-[#333] w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#161616] rounded-t-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Configure: <span className="text-[#6366f1]">{node.data.label}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-[#222] p-1.5 rounded-md hover:bg-[#333]">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-[#222] bg-[#161616]">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'settings' ? 'border-[#6366f1] text-[#6366f1]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            <Settings size={16} /> Parameters
          </button>
          <button 
            onClick={() => setActiveTab('credentials')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'credentials' ? 'border-[#00e676] text-[#00e676]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            <Key size={16} /> Credentials
          </button>
          <button 
            onClick={() => setActiveTab('advanced')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'advanced' ? 'border-[#eab308] text-[#eab308]' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
          >
            <Sliders size={16} /> Advanced Options
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0a0a]">
          
          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Node Label</label>
                <input 
                  type="text" 
                  value={formData.label || ''} 
                  onChange={(e) => handleChange('label', e.target.value)}
                  className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description / Notes</label>
                <input 
                  type="text" 
                  value={formData.description || ''} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>

              {isAI && (
                <>
                  <div className="pt-4 border-t border-[#222]">
                    <label className="block text-xs font-bold text-[#a78bfa] uppercase tracking-wider mb-2">LLM Endpoint URL</label>
                    <input 
                      type="text" 
                      value={formData.llmEndpoint || ''} 
                      onChange={(e) => handleChange('llmEndpoint', e.target.value)}
                      placeholder="https://api.openai.com/v1/chat/completions"
                      className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#a78bfa] uppercase tracking-wider mb-2">System Prompt</label>
                    <textarea 
                      rows={5}
                      value={formData.customPrompt || ''} 
                      onChange={(e) => handleChange('customPrompt', e.target.value)}
                      placeholder="You are a helpful AI assistant..."
                      className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#a78bfa]"
                    />
                  </div>
                </>
              )}

              {isHttp && (
                <div className="pt-4 border-t border-[#222]">
                  <div className="flex gap-4 mb-4">
                    <div className="w-1/3">
                      <label className="block text-xs font-bold text-[#eab308] uppercase tracking-wider mb-2">Method</label>
                      <select 
                        value={formData.httpMethod || 'GET'} 
                        onChange={(e) => handleChange('httpMethod', e.target.value)}
                        className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#eab308] appearance-none"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-[#eab308] uppercase tracking-wider mb-2">Request URL</label>
                      <input 
                        type="text" 
                        value={formData.httpUrl || ''} 
                        onChange={(e) => handleChange('httpUrl', e.target.value)}
                        placeholder="https://api.example.com/data"
                        className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]"
                      />
                    </div>
                  </div>
                  {['POST', 'PUT', 'PATCH'].includes(formData.httpMethod) && (
                    <div>
                      <label className="block text-xs font-bold text-[#eab308] uppercase tracking-wider mb-2">JSON Body</label>
                      <textarea 
                        rows={4}
                        value={formData.httpBody || ''} 
                        onChange={(e) => handleChange('httpBody', e.target.value)}
                        placeholder='{"key": "value"}'
                        className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#eab308]"
                      />
                    </div>
                  )}
                </div>
              )}

              {isWebhook && (
                <div className="pt-4 border-t border-[#222]">
                  <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Webhook URL</label>
                  <div className="bg-[#111] border border-[#333] p-3 rounded-lg text-sm text-gray-300 font-mono flex items-center justify-between mb-4">
                    <span>{typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/${workflowId}` : `/api/webhook/${workflowId}`}</span>
                    <button className="text-blue-400 hover:text-white" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/api/webhook/${workflowId}`)}>Copy</button>
                  </div>
                  <div className="w-1/3">
                    <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Allowed Method</label>
                    <select 
                      value={formData.webhookMethod || 'POST'} 
                      onChange={(e) => handleChange('webhookMethod', e.target.value)}
                      className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 appearance-none"
                    >
                      <option value="POST">POST</option>
                      <option value="GET">GET</option>
                      <option value="ANY">ANY</option>
                    </select>
                  </div>
                </div>
              )}

              {isEmail && (
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-green-400 uppercase tracking-wider mb-2">To Email Address</label>
                    <input 
                      type="email" 
                      value={formData.emailTo || ''} 
                      onChange={(e) => handleChange('emailTo', e.target.value)}
                      placeholder="user@example.com or {{payload.email}}"
                      className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={formData.emailSubject || ''} 
                      onChange={(e) => handleChange('emailSubject', e.target.value)}
                      placeholder="Your Order is Confirmed"
                      className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-green-400 uppercase tracking-wider mb-2">Email Body (Text/HTML)</label>
                    <textarea 
                      rows={5}
                      value={formData.emailBody || ''} 
                      onChange={(e) => handleChange('emailBody', e.target.value)}
                      placeholder="Hello {{payload.name}}, ..."
                      className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-400"
                    />
                  </div>
                </div>
              )}

              {isTelegram && (
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2CA5E0] uppercase tracking-wider mb-2">Bot Token</label>
                    <input type="password" value={formData.botToken || ''} onChange={(e) => handleChange('botToken', e.target.value)} placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#2CA5E0]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2CA5E0] uppercase tracking-wider mb-2">Chat ID</label>
                    <input type="text" value={formData.chatId || ''} onChange={(e) => handleChange('chatId', e.target.value)} placeholder="@channelname or 12345678" className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#2CA5E0]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2CA5E0] uppercase tracking-wider mb-2">Message</label>
                    <textarea rows={3} value={formData.message || ''} onChange={(e) => handleChange('message', e.target.value)} placeholder="Hello from {{payload.name}}!" className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#2CA5E0]" />
                  </div>
                </div>
              )}

              {isDiscord && (
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5865F2] uppercase tracking-wider mb-2">Webhook URL</label>
                    <input type="password" value={formData.webhookUrl || ''} onChange={(e) => handleChange('webhookUrl', e.target.value)} placeholder="https://discord.com/api/webhooks/..." className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5865F2] uppercase tracking-wider mb-2">Content</label>
                    <textarea rows={3} value={formData.content || ''} onChange={(e) => handleChange('content', e.target.value)} placeholder="New alert: {{payload.status}}" className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#5865F2]" />
                  </div>
                </div>
              )}

              {isOpenAI && (
                <div className="pt-4 border-t border-[#222] space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#10A37F] uppercase tracking-wider mb-2">Model</label>
                    <select value={formData.model || 'gpt-4'} onChange={(e) => handleChange('model', e.target.value)} className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#10A37F]">
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#10A37F] uppercase tracking-wider mb-2">Prompt</label>
                    <textarea rows={4} value={formData.prompt || ''} onChange={(e) => handleChange('prompt', e.target.value)} placeholder="Summarize this: {{payload.text}}" className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#10A37F]" />
                  </div>
                </div>
              )}

              {isCode && (
                <div className="pt-4 border-t border-[#222]">
                  <label className="block text-xs font-bold text-[#00e676] uppercase tracking-wider mb-2">Custom Code (JS / Node.js)</label>
                  <textarea 
                    rows={8}
                    value={formData.customCode || ''} 
                    onChange={(e) => handleChange('customCode', e.target.value)}
                    placeholder="function execute(data) {\n  return data;\n}"
                    className="w-full bg-[#050505] border border-[#333] rounded-lg px-4 py-3 text-[#00e676] font-mono text-sm focus:outline-none focus:border-[#00e676]"
                  />
                </div>
              )}
            </div>
          )}

          {/* CREDENTIALS TAB */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div className="bg-[#1a1a2e]/50 border border-[#333] p-5 rounded-xl">
                <label className="block text-sm font-semibold text-white mb-2">Select Credential for this Node</label>
                <p className="text-xs text-gray-400 mb-4">Choose an existing authentication credential to securely connect to external services.</p>
                
                <select 
                  value={formData.credentialId || ''} 
                  onChange={(e) => handleChange('credentialId', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#444] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00e676] appearance-none"
                >
                  <option value="">-- No Credential Required --</option>
                  {credentials.map(cred => (
                    <option key={cred.id} value={cred.id}>{cred.name} ({cred.type})</option>
                  ))}
                </select>
              </div>

              {!showNewCredForm ? (
                <button 
                  onClick={() => setShowNewCredForm(true)}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-dashed border-[#555] text-gray-300 hover:text-white hover:border-[#00e676] hover:bg-[#00e676]/5 rounded-xl transition-all"
                >
                  <Plus size={18} /> Add New Credential
                </button>
              ) : (
                <div className="bg-[#161616] border border-[#333] p-5 rounded-xl space-y-4">
                  <h3 className="text-sm font-bold text-[#00e676]">Create New Credential</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Credential Name</label>
                      <input 
                        type="text" 
                        value={newCredName}
                        onChange={(e) => setNewCredName(e.target.value)}
                        placeholder="e.g. OpenAI API Key"
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#00e676] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Type</label>
                      <select 
                        value={newCredType}
                        onChange={(e) => setNewCredType(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#00e676] outline-none"
                      >
                        <option value="api_key">API Key (Header/Query)</option>
                        <option value="oauth2">OAuth2</option>
                        <option value="basic_auth">Basic Auth</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Secret Key / Token</label>
                    <input 
                      type="password" 
                      value={newCredValue}
                      onChange={(e) => setNewCredValue(e.target.value)}
                      placeholder="sk-..."
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:border-[#00e676] outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleCreateCredential}
                      className="bg-[#00e676] hover:bg-[#00c853] text-black px-4 py-1.5 rounded text-sm font-bold transition-colors"
                    >
                      Save Credential
                    </button>
                    <button 
                      onClick={() => setShowNewCredForm(false)}
                      className="bg-[#222] hover:bg-[#333] text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ADVANCED OPTIONS TAB */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">Dynamic Parameters</h3>
                  <p className="text-xs text-gray-400">Add custom headers, query params, or variables.</p>
                </div>
                <button 
                  onClick={handleAddParam}
                  className="flex items-center gap-1 bg-[#222] hover:bg-[#333] border border-[#444] px-3 py-1.5 rounded text-xs font-bold text-white transition-colors"
                >
                  <Plus size={14} /> Add Option
                </button>
              </div>

              {(formData.advancedParams || []).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-[#333] rounded-xl text-gray-500 text-sm">
                  No advanced options configured.
                </div>
              ) : (
                <div className="space-y-3">
                  {(formData.advancedParams || []).map((param: any, index: number) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={param.key}
                          onChange={(e) => handleUpdateParam(index, 'key', e.target.value)}
                          placeholder="Key (e.g. Content-Type)"
                          className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-[#eab308] outline-none"
                        />
                      </div>
                      <div className="flex-[2]">
                        <input 
                          type="text" 
                          value={param.value}
                          onChange={(e) => handleUpdateParam(index, 'value', e.target.value)}
                          placeholder="Value (e.g. application/json)"
                          className="w-full bg-[#1a1a2e] border border-[#333] rounded-lg px-3 py-2 text-white text-sm font-mono focus:border-[#eab308] outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveParam(index)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors mt-0.5"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222] bg-[#161616] flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#222] transition-colors font-medium text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] text-white px-6 py-2 rounded-lg transition-all font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] text-sm">
            <Save size={16} />
            Save Workflow Node
          </button>
        </div>
      </div>
    </div>
  );
};
