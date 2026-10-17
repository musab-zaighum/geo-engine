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
      content: `**CiteMed Clinical GEO Advisor**

How can I help you optimize your practice or agency today?

- **Pricing:** $1,000 Wholesale / $2,500 Retail packages
- **Clinical Scripts:** Cold Email & Physician outreach outlines
- **Objections:** Handling "We already pay for SEO" or "No Website (GBP Only)"`,
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
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-600 rounded-full" />
          </div>
          <span className="text-xs font-semibold pr-1.5 hidden sm:inline">CiteMed Advisor</span>
        </button>
      )}

      {/* Expanded Corner Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[400px] h-[520px] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  CiteMed AI Advisor
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400">Clinical Strategy &amp; GEO Architecture</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id || Math.random()}
                className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                    m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>

                <div
                  className={`max-w-[82%] p-3 rounded-xl text-xs space-y-1 ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans leading-relaxed">
                    {m.content}
                  </div>
                  {m.timestamp && (
                    <div
                      className={`text-[9px] ${
                        m.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400 text-left'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 shadow-2xs w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Consulting clinical knowledge base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Buttons */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex overflow-x-auto gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleSend('What is the $1,000 wholesale / $2,500 retail pricing model?')}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              Pricing Model
            </button>
            <button
              type="button"
              onClick={() => handleSend('Give me a cold outreach script for a Specialist Plastic Surgeon')}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              Doctor Outreach Script
            </button>
            <button
              type="button"
              onClick={() => handleSend('How do I handle the objection "We already pay $5k/mo for SEO"?')}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0 font-medium"
            >
              SEO Objection
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask GEO clinical question..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors shrink-0 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
