"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Clock, User, AlertCircle, Tag } from "lucide-react";

function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSupportPage() {
  const messages = useQuery(api.support.getMessages);

  if (messages === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl text-muted-foreground">
        <Mail className="w-12 h-12 mb-4 opacity-50" />
        <p>No support messages yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Support Messages ({messages.length})</h2>
      </div>

      <div className="grid gap-4">
        {messages.map((msg) => (
          <div key={msg._id} className="border rounded-xl p-5 bg-card/50 hover:bg-card transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {msg.subject}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> {msg.name} ({msg.email})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {formatDateTime(msg.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {msg.type && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {msg.type}
                  </span>
                )}
                {msg.priority && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1
                    ${msg.priority === 'critical' ? 'bg-red-500/10 text-red-500' : 
                      msg.priority === 'high' ? 'bg-orange-500/10 text-orange-500' : 
                      'bg-blue-500/10 text-blue-500'}`}>
                    <AlertCircle className="w-3 h-3" /> {msg.priority}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm whitespace-pre-wrap leading-relaxed border border-border/50">
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
