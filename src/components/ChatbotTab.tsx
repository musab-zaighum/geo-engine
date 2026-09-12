'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
  HelpCircle,
  BookOpen,
  DollarSign,
  Mail,
  ShieldCheck,
  GlobeX,
  Trash2,
  Code,
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';

export function ChatbotTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 👋 Welcome to the Master CiteMed AI Advisor & Tutor

I am your embedded AI strategist trained on the entire **CiteMed Knowledge Base**.

Ask me anything about:
- **CMS Code Insertion:** Step-by-step for WordPress, Shopify, Webflow, Squarespace & Wix
- **Agency Pricing & Margins:** Solo Doctors ($1,497 retail / $497 wholesale) vs Clinics ($2,497 retail / $897 wholesale)
- **Cold Outreach Scripts:** High-converting email & pitch templates for surgeons and practice directors
- **Technical GEO Standards:** Schema.org \`@graph\` markup, Ahpra/NPI credentials, and \`/llms.txt\` setup

Click any quick topic below or type your question!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      label: '📋 WordPress Code Guide',
      prompt: 'How do I paste this schema into WordPress/WooCommerce?',
      icon: Code,
    },
    {
      label: '🛍️ Shopify /llms.txt Guide',
      prompt: 'How do I upload llms.txt if the client is on Shopify?',
      icon: Code,
    },
    {
      label: '💰 Pricing & Profit Margins',
      prompt: 'Explain the pricing and agency profit margins for 5 clinics.',
      icon: DollarSign,
    },
    {
      label: '✉️ Pitch Solo Plastic Surgeon',
      prompt: 'Write a pitch to a solo plastic surgeon explaining why they need this.',
      icon: Mail,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch chatbot response.');
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `⚠️ Error: ${err?.message || 'Unable to communicate with CiteMed AI.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              Master CiteMed AI Advisor & Tutor
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                Online & Ready
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Teaches CMS code installation, sales pitches, and Ahpra/NPI schema standards.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-xs flex items-center gap-1"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id || Math.random()}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.content}
              </div>

              {msg.timestamp && (
                <div
                  className={`text-[10px] ${
                    msg.role === 'user' ? 'text-teal-200 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
              <span>Consulting CiteMed Master Knowledge Base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex overflow-x-auto gap-2 text-xs">
        {quickPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(item.prompt)}
            disabled={loading}
            className="px-3 py-1.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl border border-slate-200 font-bold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Tutor (e.g. how to paste into WordPress or Shopify)..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-teal-500 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold rounded-2xl shadow-md shadow-teal-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all shrink-0 text-xs sm:text-sm"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
