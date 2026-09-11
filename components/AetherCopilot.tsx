"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  X,
  Send,
  HelpCircle,
  RotateCcw,
  Zap,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "How does the Hosted Passport work?",
  "Explain my 0-100 Threat Score",
  "I don't have a website—can I still use this?",
  "How to rank on Perplexity & ChatGPT?",
];

export default function AetherCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to AetherGEO! I'm your official In-App Copilot. I can guide you through setting up your Hosted AI Passport, interpreting your AI Threat Score, generating JSON-LD schemas, or scaling via Agency OS. How can I assist your business today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      const assistantReply =
        data.content ||
        "I am here to guide you on AetherGEO features, AI rankings, and Hosted Passports.";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: assistantReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          role: "assistant",
          content:
            "I am ready to help you navigate AetherGEO. Please ask about your AI Threat Score, Hosted Passport, or GEO optimization.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation reset. How can I help you optimize your business's presence across ChatGPT, Perplexity, and Apple Intelligence today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <aside aria-label="Aether Copilot Assistant" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] mb-4 flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-4 px-5 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 border border-blue-500">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                      Aether Copilot
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    Ask about your AI Passport, Threat Score, or tools
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={resetChat}
                  title="Reset conversation"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Copilot"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/80"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Aether Copilot</span>
                      </div>
                    )}
                    <div className="whitespace-pre-line break-words">
                      {msg.content}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-blue-600" />
                  Quick Inquiries
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="text-[11px] text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full px-2.5 py-1 transition-all duration-150 flex items-center gap-1 text-left disabled:opacity-50 shadow-2xs"
                  >
                    <span>{prompt}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar & Platform Disclaimer */}
            <div className="p-3.5 border-t border-slate-200 bg-white flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about AetherGEO features or AI ranking..."
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-slate-900 rounded-xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm placeholder:text-slate-400 transition"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputValue.trim()}
                  title="Send message"
                  className="absolute right-1.5 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition shadow-sm shadow-blue-500/30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 tracking-wide uppercase font-medium">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Restricted to AetherGEO platform guidance.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launch Trigger Button (Bottom-Right Corner) */}
      <div className="relative flex items-center">
        {/* Tooltip on Hover */}
        <AnimatePresence>
          {isTooltipVisible && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute right-16 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl border border-slate-800 shadow-xl whitespace-nowrap pointer-events-none flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Need help? Ask Aether Copilot</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          className="relative group p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300"
          aria-label={isOpen ? "Close Aether Copilot" : "Open Aether Copilot"}
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md group-hover:blur-lg transition-all"></div>

          {/* Pulsing Online Indicator Dot (Emerald Green) */}
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-85"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
          </span>

          {isOpen ? (
            <X className="w-6 h-6 text-white relative z-10 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white group-hover:scale-110 transition duration-200" />
              <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-spin [animation-duration:6s]" />
            </div>
          )}
        </motion.button>
      </div>
    </aside>
  );
}
