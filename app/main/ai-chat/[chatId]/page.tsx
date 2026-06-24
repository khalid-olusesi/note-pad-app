"use client";

import { useState, useRef, useEffect, use } from "react";
import {
  Sparkles,
  Send,
  User,
  Notebook,
  ChevronRight,
  Lightbulb,
  Clock,
  Zap,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useSidebar } from "../_context/sidebar-context";

type MessageSource = {
  noteId: string;
  title: string;
  excerpt: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: MessageSource[];
  timestamp: Date;
};

const SUGGESTIONS = [
  { icon: Clock, text: "Summarize my notes from this week" },
  { icon: Lightbulb, text: "What ideas have I been exploring lately?" },
  { icon: FileText, text: "Show me all my Work notes" },
  { icon: Zap, text: "What tasks have I been procrastinating on?" },
];

function ChatLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-1">
      <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-sm" />
      </div>
      <div className="flex gap-3 max-w-[85%]">
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-20 w-full max-w-md rounded-2xl rounded-tl-sm" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        <Skeleton className="h-10 w-36 rounded-2xl rounded-tr-sm" />
      </div>
      <div className="flex gap-3 max-w-[85%]">
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-24 w-full max-w-lg rounded-2xl rounded-tl-sm" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AssistantMessage({
  message,
  onOpenNote,
}: {
  message: Message;
  onOpenNote: (noteId: string) => void;
}) {
  return (
    <div className="flex gap-3 max-w-[85%]">
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mt-1">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        {/* Bubble */}
        <div className="bg-muted/50 border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
        </div>

        {/* Source notes */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground px-1 font-medium">
              Sources from your notes
            </p>
            {message.sources.map((src) => (
              <button
                key={src.noteId}
                type="button"
                onClick={() => onOpenNote(src.noteId)}
                className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-purple-500/5 border border-purple-500/20 hover:bg-purple-500/10 transition-colors text-left group"
              >
                <Notebook className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-purple-400 truncate">
                    {src.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {src.excerpt}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        )}

        <span className="text-xs text-muted-foreground/50 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center mt-1">
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1 items-end">
        <div className="bg-purple-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground/50 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default function ChatViewPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const router = useRouter();
  const { toggle } = useSidebar();
  const { data: session } = authClient.useSession();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Unwrap params Promise
  const { chatId } = use(params);

  const rawMessages = useQuery(api.notes.getMessages, {
    chatId: chatId as any,
  });

  const userNotes = useQuery(api.notes.getNotesList);

  const dbMessages: Message[] = (rawMessages ?? []).map((msg) => ({
    id: msg._id,
    role: msg.role,
    content: msg.content,
    sources: msg.sources?.map((src) => ({
      noteId: src.noteId,
      title: src.title,
      excerpt: src.excerpt,
    })),
    timestamp: new Date(msg.createdAt),
  }));

  const createMessage = useMutation(api.notes.createMessage);
  const lastProcessedUserMessageId = useRef<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages]);

  useEffect(() => {
    if (!rawMessages?.length || isLoading) return;
    if (userNotes === undefined) return;

    const lastMessage = rawMessages[rawMessages.length - 1];
    if (
      lastMessage.role !== "user" ||
      lastMessage._id === lastProcessedUserMessageId.current
    ) {
      return;
    }

    lastProcessedUserMessageId.current = lastMessage._id;
    setIsLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: rawMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            notes: userNotes.map((note) => ({
              id: note._id,
              title: note.title,
              tag: note.tag,
              createdAt: note.createdAt,
              body: note.body,
            })),
          }),
        });

        const raw = await res.text();
        let data: {
          answer?: string;
          sources?: MessageSource[];
          error?: string;
        } = {};
        if (raw) {
          try {
            data = JSON.parse(raw);
          } catch {
            throw new Error("Invalid response from AI service");
          }
        }

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to get AI response");
        }

        await createMessage({
          chatId: chatId as unknown as any,
          role: "assistant",
          content: data.answer ?? "No response received.",
          sources: data.sources?.length
            ? data.sources.map((src) => ({
                noteId: src.noteId as any,
                title: src.title,
                excerpt: src.excerpt,
              }))
            : undefined,
        });
      } catch (error) {
        console.error("Error getting AI response:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Sorry, I couldn't generate a response. Please try again.";
        await createMessage({
          chatId: chatId as unknown as any,
          role: "assistant",
          content: message,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [rawMessages, isLoading, chatId, createMessage, userNotes]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  async function handleSend() {
    if (!input.trim() || isLoading || !session?.user?.id) return;

    const messageContent = input.trim();
    setInput("");

    try {
      await createMessage({
        chatId: chatId as unknown as any,
        role: "user",
        content: messageContent,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleOpenNote(noteId: string) {
    router.push(`/main?noteId=${noteId}`);
  }

  function handleSuggestion(text: string) {
    if (isLoading || !session?.user?.id) return;

    setInput("");
    createMessage({
      chatId: chatId as unknown as any,
      role: "user",
      content: text,
    }).catch((error) => {
      console.error("Error sending suggestion:", error);
    });
  }

  const isMessagesLoading = rawMessages === undefined;
  const isEmptyChat = !isMessagesLoading && dbMessages.length === 0;

  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)] w-full max-w-3xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border/50">
        <button
          onClick={toggle}
          className="p-2 bg-muted/20 hover:bg-muted rounded-2xl transition-colors text-muted-foreground"
          aria-label="Open chat list"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">KhalNote AI</h1>
          <p className="text-xs text-muted-foreground">
            Ask anything about your notes
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Ready</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {isMessagesLoading ? (
          <ChatLoadingSkeleton />
        ) : isEmptyChat ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Your Second Brain</h2>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Ask me anything about your notes. I can find ideas, summarize
                topics, spot patterns, and surface things you&apos;ve forgotten.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
              {SUGGESTIONS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => handleSuggestion(text)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-purple-500/30 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-sm sm:text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                    {text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {dbMessages?.map((msg) =>
              msg.role === "user" ? (
                <UserMessage key={msg.id} message={msg} />
              ) : (
                <AssistantMessage
                  key={msg.id}
                  message={msg}
                  onOpenNote={handleOpenNote}
                />
              ),
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/50 border border-border/60 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0ms]" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:150ms]" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestion chips after conversation starts */}
            {!isLoading && dbMessages.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.slice(0, 2).map(({ text }) => (
                  <button
                    key={text}
                    onClick={() => handleSuggestion(text)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-muted/30 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-end gap-2 bg-muted/30 border border-border/60 rounded-2xl px-4 py-3 focus-within:border-purple-500/50 focus-within:bg-muted/50 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your notes... (Shift + Enter for new line)"
            rows={1}
            className="flex-1 scrollbar-none bg-transparent text-sm resize-none outline-none placeholder:text-muted-foreground/50 max-h-40 leading-relaxed"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/40 text-center mt-2">
          KhalNote AI reads your private notes only. Nothing is shared
          externally.
        </p>
      </div>
    </div>
  );
}
