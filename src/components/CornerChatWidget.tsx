'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  X,
  Sparkles,
  RefreshCw,
  MessageSquare,
  ChevronDown,
  DollarSign,
  Mail,
  ShieldCheck,
  GlobeX,
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';

export function CornerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Master CiteMed AI Advisor**

How can I help you optimize your practice or agency today?

- **Pricing:** $1,000 Wholesale / $2,500 Retail
- **Scripts:** Cold Email & LinkedIn Outlines
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
        body: JSON.stringify({ messages: newMsgs }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI response.');
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `⚠️ ${err?.message || 'Chatbot execution error.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white rounded-full shadow-2xl shadow-teal-600/40 flex items-center gap-3 transition-all hover:scale-105 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <span className="text-xs font-bold pr-1 hidden sm:inline">CiteMed AI Advisor</span>
        </button>
      )}

      {/* Expanded Corner Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[420px] h-[550px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  CiteMed AI Advisor
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </div>
                <div className="text-[10px] text-slate-300">GEO Strategy & Objection Assistant</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
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
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-teal-600 text-white'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans leading-relaxed">
                    {m.content}
                  </div>
                  {m.timestamp && (
                    <div
                      className={`text-[9px] ${
                        m.role === 'user' ? 'text-teal-200 text-right' : 'text-slate-400 text-left'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 shadow-sm w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Consulting AI Knowledge Base...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Buttons */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex overflow-x-auto gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleSend('What is the $1,000 wholesale / $2,500 retail pricing model?')}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              💰 Pricing Model
            </button>
            <button
              type="button"
              onClick={() => handleSend('Give me a cold email script for a Plastic Surgeon')}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              ✉️ Cold Email
            </button>
            <button
              type="button"
              onClick={() => handleSend('How do I handle the objection "We already pay $5k/mo for SEO"?')}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              🛡️ SEO Objection
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl disabled:opacity-50 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
