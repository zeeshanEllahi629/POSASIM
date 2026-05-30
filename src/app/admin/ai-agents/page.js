import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AIAgentsLogsPage() {
  const logs = await prisma.ai_agent_logs.findMany({
    orderBy: { created_at: 'desc' },
    take: 100
  });

  const chatMemory = await prisma.ai_chat_memory.findMany({
    orderBy: { created_at: 'desc' },
    take: 50
  });

  return (
    <div className="min-h-screen bg-[#0f0f13] text-gray-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#1a1a24] p-6 rounded-xl border border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Agent Workspace</h1>
            <p className="text-gray-400">Monitor live AI operations, LLM tool calls, and automated workflow logs.</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-[#242436] px-4 py-2 rounded-lg text-center">
              <span className="block text-xs text-gray-400 uppercase tracking-wider">Total Operations</span>
              <span className="text-xl font-bold text-[#00e676]">{logs.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Agent Action Logs */}
          <div className="bg-[#1a1a24] rounded-xl border border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800 bg-[#222230] rounded-t-xl">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="bg-purple-600/20 text-purple-400 p-1 rounded mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Agent Operations Log
              </h2>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto max-h-[600px] space-y-3">
              {logs.map(log => (
                <div key={log.id} className="p-4 rounded-lg bg-[#0f0f13] border border-gray-800 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${log.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {log.status}
                      </span>
                      <span className="text-sm font-semibold text-gray-300">{log.node_name}</span>
                      <span className="text-xs text-gray-500">({log.action})</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-400 bg-[#15151e] p-2 rounded truncate">
                    {log.payload}
                  </div>
                </div>
              ))}
              {logs.length === 0 && <p className="text-gray-500 text-center py-10">No agent operations recorded yet.</p>}
            </div>
          </div>

          {/* AI Chat Memory */}
          <div className="bg-[#1a1a24] rounded-xl border border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800 bg-[#222230] rounded-t-xl">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="bg-blue-600/20 text-blue-400 p-1 rounded mr-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </span>
                Agent Chat Memory (Database)
              </h2>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto max-h-[600px] space-y-4">
              {chatMemory.map(mem => (
                <div key={mem.id} className={`flex flex-col ${mem.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-500 mb-1 px-1 uppercase tracking-wider">{mem.role}</span>
                  <div className={`p-3 rounded-xl max-w-[85%] text-sm ${
                    mem.role === 'user' 
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100' 
                      : 'bg-gray-800/50 border border-gray-700 text-gray-200'
                  }`}>
                    {mem.content}
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1">{new Date(mem.created_at).toLocaleString()} - Session: {mem.session_id}</span>
                </div>
              ))}
              {chatMemory.length === 0 && <p className="text-gray-500 text-center py-10">No chat memory stored in database.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
