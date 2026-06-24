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
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AIChatPage() {
  const router = useRouter();
  const [startingPrompt, setStartingPrompt] = useState<string | null>(null);

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

  const suggestions = [
    { icon: Clock, text: "Summarize my notes from this week" },
    { icon: Lightbulb, text: "What ideas have I been exploring lately?" },
    { icon: FileText, text: "Show me all my Work notes" },
    { icon: Zap, text: "What tasks have I been procrastinating on?" },
  ];

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-background to-muted/30">
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-12">
        {/* Logo & Greeting */}
        <div className="text-center space-y-4 max-w-xl">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How can I help you today?
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Ask anything about your notes. I can find ideas, summarize topics,
            and more.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
          {suggestions.map(({ icon: Icon, text }) => (
            <button
              key={text}
              onClick={() => handleSuggestion(text)}
              disabled={!!startingPrompt}
              className="group flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-border transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="w-5 h-5 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors mt-0.5">
                {startingPrompt === text ? (
                  <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />
                ) : (
                  <Icon className="w-3 h-3 text-purple-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{text}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
