"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Sparkles, X, Send, RefreshCw, ChevronDown, 
  ShieldCheck, ArrowRight, HelpCircle, MessageSquare
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DrCiteBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Dr. CiteBot, your AI Clinical GEO Concierge. Ask me any question about ChatGPT Search visibility, Schema.org @graph payloads, or /llms.txt standard files.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "How do I install Schema on WordPress?",
    "How do I upload the /llms.txt file?",
    "Why isn't my clinic showing up on ChatGPT?",
    "What is an llms.txt file in plain English?",
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend.slice(0, 4000) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!userText) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        let errorMsg = "Failed to fetch response";
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.content || data.error || "No response received." }]);
      } else if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = "";

        // Add initial placeholder for streaming response
        setMessages([...newMessages, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantReply += chunk;

          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].role === "assistant") {
              updated[updated.length - 1] = { role: "assistant", content: assistantReply };
            }
            return updated;
          });
        }
      } else {
        const text = await res.text();
        setMessages([...newMessages, { role: "assistant", content: text }]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Traditional clinic websites place doctor credentials inside standard HTML div tags which AI crawlers ignore. Answer engines like ChatGPT Search query structured vector stores and machine-readable entity graphs. Head over to our 1-Click Generator Studio (/generate) or explore our Turnkey Plans (/pricing)!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-extrabold px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition duration-200 border border-emerald-300/40"
        >
          {/* Pulsing Green Status Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
          </span>

          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 stroke-[2.5]" />
            <span className="text-xs font-black tracking-tight">Ask Dr. CiteBot</span>
          </div>

          <div className="hidden sm:block bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold text-slate-950">
            ONLINE
          </div>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[420px] h-[520px] sm:h-[580px] bg-[#060911]/95 border border-emerald-500/40 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/80 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-extrabold shadow-md shadow-emerald-500/20">
                <Bot className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-bold text-white">Dr. CiteBot AI</h4>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    GEO CONCIERGE
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Dr. CiteBot Online | Ask any AI search question</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs overflow-x-hidden">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed overflow-x-auto whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-emerald-400 text-slate-950 font-semibold rounded-br-none shadow-md shadow-emerald-500/10"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none font-sans"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-slate-400 flex items-center space-x-2 text-xs">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                  <span>Dr. CiteBot is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[10px] text-slate-300 px-2.5 py-1 rounded-full transition flex-shrink-0"
              >
                💬 {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#060911] border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask Dr. CiteBot a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 p-2.5 rounded-xl transition disabled:opacity-40"
            >
              <Send className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
