"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ArrowUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "../_context/sidebar-context";
import { Sparkles } from "lucide-react";

export default function NewChatPage() {
  const router = useRouter();
  const { isOpen, toggle } = useSidebar();
  const createChatMutation = useMutation(api.notes.createChat);
  const createMessageMutation = useMutation(api.notes.createMessage);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [message]);

  async function handleSend() {
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);

      // Generate title from first message (first 50 chars or first sentence)
      const title = message.substring(0, 50).trim();

      // Create new chat
      const chatId = await createChatMutation({ title });

      // Create user message in new chat
      await createMessageMutation({
        chatId,
        role: "user",
        content: message,
      });

      // Navigate to new chat
      router.push(`/main/ai-chat/${chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col bg-linear-to-b from-background to-muted/30 px-4">
      {/* Back Button */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="flex items-center gap-2 py-3">
          <div
            onClick={toggle}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-lg hover:bg-muted/50 px-2.5 py-1.5 -ml-2"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>

        <div>
          <h1 className="text-base font-semibold leading-tight">KhalNote AI</h1>
          <p className="text-xs text-muted-foreground">
            Ask anything about your notes
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            What would you like to know?
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Ask anything about your notes. I can summarize, find ideas, and help
            you discover connections.
          </p>
        </div>

        {/* Input Area */}
        <div className="w-full max-w-2xl">
          <div className="relative rounded-2xl border border-border/50 bg-card shadow-lg focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Ctrl+Enter to send)"
              className="w-full px-4 py-3 bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none max-h-40 min-h-13"
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="absolute bottom-4 right-4 p-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all hover:shadow-lg"
              title="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Ctrl + Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
