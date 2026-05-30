"use client";
import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am the Foodefy AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pathname = usePathname();

  // Don't show widget on admin pages or workflow designer
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/embed'))) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/webhook/website-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMessage })
      });

      const data = await response.json();
      
      let aiResponse = "Sorry, I couldn't process your request.";
      if (data.success && data.data && data.data.aiResponse) {
        aiResponse = data.data.aiResponse;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Error connecting to AI Brain. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#00e676] to-[#00b894] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform z-[9999]"
      >
        {isOpen ? (
          <i className="fas fa-times text-xl"></i>
        ) : (
          <i className="fas fa-robot text-2xl"></i>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-[#1a1a2e] border border-[#333] rounded-2xl shadow-2xl flex flex-col z-[9999] overflow-hidden font-sans">
          
          <div className="h-16 bg-[#0a0a0f] border-b border-[#333] flex items-center px-4 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-[#00e676] to-[#00b894] rounded-full flex items-center justify-center text-white mr-3">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Foodefy Agent</h3>
              <p className="text-xs text-[#00e676] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span> Online
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-[#00e676] to-[#00b894] text-white rounded-br-none' 
                      : 'bg-[#222] text-gray-200 border border-[#333] rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#222] border border-[#333] rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-[#0a0a0f] border-t border-[#333]">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..." 
                className="w-full bg-[#1a1a2e] border border-[#333] rounded-full pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e676] transition-colors"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#00e676] rounded-full text-black hover:bg-[#00c853] transition-colors disabled:opacity-50"
              >
                <i className="fas fa-paper-plane text-xs"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
