"use client";

import { useState } from "react";
import {
  Sparkles,
  Clock,
  Lightbulb,
  FileText,
  Zap,
  ArrowRight,
  Loader2,
  ArrowUp,
  PanelLeftOpen,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useSidebar } from "./_context/sidebar-context";

export default function AIChatPage() {
  const router = useRouter();
  const { toggle, isOpen } = useSidebar();
  const [startingPrompt, setStartingPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const createChatMutation = useMutation(api.notes.createChat);
  const createMessageMutation = useMutation(api.notes.createMessage);

  async function handleSuggestion(text: string) {
    if (startingPrompt) return;

    try {
      setStartingPrompt(text);
      const title = text.substring(0, 50).trim();
      const chatId = await createChatMutation({ title });
      await createMessageMutation({
        chatId,
        role: "user",
        content: text,
      });
      router.push(`/main/ai-chat/${chatId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      setStartingPrompt(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputValue.trim() || startingPrompt) return;
    
    try {
      const text = inputValue.trim();
      setStartingPrompt(text);
      const title = text.substring(0, 50).trim();
      const chatId = await createChatMutation({ title });
      await createMessageMutation({
        chatId,
        role: "user",
        content: text,
      });
      router.push(`/main/ai-chat/${chatId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      setStartingPrompt(null);
    }
  }

  const suggestions = [
    { icon: Clock, text: "Summarize my notes from this week" },
    { icon: Lightbulb, text: "What ideas have I been exploring lately?" },
    { icon: FileText, text: "Show me all my Work notes" },
    { icon: Zap, text: "What tasks have I been procrastinating on?" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-57px)] bg-linear-to-b from-background to-muted/30 relative">
      {/* Mobile Toggle Button */}
      <div className="md:hidden absolute top-4 left-4 z-10">
        <button
          onClick={toggle}
          className="p-2 bg-background border border-border/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 px-4 sm:px-8 py-10 sm:py-12 lg:py-24 max-w-6xl mx-auto min-h-full">
          {/* Left Side: Greeting & Chat Box */}
          <div className="text-left space-y-6 w-full lg:w-1/2 flex flex-col items-center lg:items-start mt-10 md:mt-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                How can I help you today?
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Ask anything about your notes. I can find ideas, summarize topics,
                and more.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full relative mt-4 max-w-lg mx-auto lg:mx-0">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your notes..."
                disabled={!!startingPrompt}
                className="w-full bg-card border border-border/50 rounded-2xl pl-4 sm:pl-5 pr-12 sm:pr-14 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !!startingPrompt}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all cursor-pointer"
              >
                {startingPrompt && inputValue ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Suggestions */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3 max-w-lg mx-auto lg:mx-0 pt-4 lg:pt-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 text-center lg:text-left">
            Try asking about
          </p>
          {suggestions.map(({ icon: Icon, text }) => (
            <button
              key={text}
              onClick={() => handleSuggestion(text)}
              disabled={!!startingPrompt}
              className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border border-border/50 bg-card hover:bg-muted/50 hover:border-border transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                {startingPrompt === text ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                )}
              </div>
              <div className="flex-1 mt-0.5 sm:mt-1">
                <p className="text-xs sm:text-sm font-medium text-foreground leading-relaxed">{text}</p>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5 sm:mt-1 translate-x-[-5px] sm:translate-x-[-10px] group-hover:translate-x-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
