'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bot,
  User,
  Send,
  X,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';

export function CornerChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `**NexusRank1 Clinical Practice GEO Advisor**

How can I help protect your clinic's search presence today?

- **Full Clinic Deployment:** $1,500 One-Time (0 Monthly Retainers • 90-Day 1-Patient ROI Guarantee)
- **Competitor Steal Radar:** Alerts when ChatGPT recommends a rival clinic
- **Clinical Schema & /llms.txt:** CMS guides for WordPress, Webflow & Squarespace`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages([
        ...newMsgs,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || 'I could not generate a reply at this time.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMsgs,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Advisor connection error: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (pathname?.startsWith('/report/')) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white rounded-full shadow-2xl shadow-emerald-950/70 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 border-2 border-emerald-900 rounded-full animate-pulse" />
          </div>
          <span className="text-xs font-bold pr-1.5 hidden sm:inline">Practice GEO Advisor</span>
        </button>
      )}

      {/* Expanded Corner Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[420px] h-[540px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-emerald-950/40 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5 text-white">
                  NexusRank1 Practice Advisor
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Clinical Local Growth &amp; GEO Defense</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
              aria-label="Close Advisor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/90">
            {messages.map((m) => (
              <div
                key={m.id || Math.random()}
                className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-emerald-400 border border-slate-700/80'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[84%] p-3.5 rounded-xl text-xs space-y-1 ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans leading-relaxed">
                    {m.content}
                  </div>
                  {m.timestamp && (
                    <div
                      className={`text-[9px] ${
                        m.role === 'user' ? 'text-emerald-100/80 text-right' : 'text-slate-500 text-left'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-400 shadow-sm w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Consulting clinical knowledge base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Buttons */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex overflow-x-auto gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleSend('What are the direct practice pricing tiers and 1-patient ROI guarantee?')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded-lg border border-emerald-500/20 transition-colors whitespace-nowrap shrink-0 font-medium cursor-pointer"
            >
              Practice Pricing
            </button>
            <button
              type="button"
              onClick={() => handleSend('How does NexusRank1 defend my clinic when ChatGPT recommends my competitor?')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors whitespace-nowrap shrink-0 font-medium cursor-pointer"
            >
              Competitor Steal Defense
            </button>
            <button
              type="button"
              onClick={() => handleSend('How do I install the schema on WordPress, Webflow, or Squarespace?')}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors whitespace-nowrap shrink-0 font-medium cursor-pointer"
            >
              CMS Install Guide
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask clinic GEO question..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-40 transition-colors shrink-0 shadow-md cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
