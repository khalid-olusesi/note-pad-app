"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { MessageCircle, Trash2, MoreHorizontal, X, ArrowLeft, PanelLeftOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, useSidebar } from "./_context/sidebar-context";

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const chats = useQuery(api.notes.getChats);
  const delChat = useMutation(api.notes.delAichat);

  const isLoading = chats === undefined;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={toggle}
      />
      <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border/50 bg-background flex flex-col shrink-0 p-2 shadow-2xl md:static md:z-auto md:w-80 md:border-r md:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 space-y-0">
          <div className="flex-1 pr-2">
            <button
              onClick={() => router.push("/main/ai-chat/new")}
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
            >
              + New Chat
            </button>
          </div>
          <button
            onClick={toggle}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors"
            aria-label="Close chats"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={toggle}
            className="hidden md:flex p-2 rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors shrink-0 ml-2 cursor-pointer"
            aria-label="Close sidebar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 border-b border-border/50">
          <h2 className="text-sm font-semibold text-muted-foreground px-1">
            Recent chats
          </h2>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isLoading ? (
            <div className="space-y-1 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <Skeleton className="w-4 h-4 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {chats.map((chat) => {
                const isActive = pathname === `/main/ai-chat/${chat._id}`;
                return (
                  <div
                    key={chat._id}
                    onClick={() => router.push(`/main/ai-chat/${chat._id}`)}
                    className={`w-full text-left group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                      isActive
                        ? "bg-muted/60 border-border/50"
                        : "hover:bg-muted/60 border-transparent hover:border-border/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <MessageCircle className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(chat.createdAt)}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted/80 transition-all shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer"
                          onClick={async () => {
                            await delChat({ noteId: chat._id });
                            if (isActive) router.push("/main/ai-chat");
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="flex h-[calc(100vh-57px)] relative">
      <Sidebar />
      {!isOpen && (
        <div className="absolute top-4 left-4 z-10 hidden md:block">
          <button
            onClick={toggle}
            className="p-2 bg-background border border-border/50 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shadow-sm cursor-pointer"
            aria-label="Open sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="flex-1 min-w-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}

export default function AiChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}
