"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import Image from "next/image";

export default function TrashPage() {
  const notes = useQuery(api.notes.getTrashedNotes);
  const restoreNote = useMutation(api.notes.restoreNote);
  const deleteNote = useMutation(api.notes.deleteNote);
  const deleteAllTrashedNotes = useMutation(api.notes.deleteAllTrashedNotes);

  // Get current time with lazy initializer to avoid calling during render
  const [now] = useState(() => Date.now());

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} • ${timePart}`;
  };

  const getDaysRemaining = (deletedAt?: number) => {
    if (!deletedAt) return null;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    const timeRemaining = thirtyDays - (now - deletedAt);
    const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60 * 1000));
    return Math.max(0, daysRemaining);
  };

  const handleRestore = async (noteId: Id<"notes">) => {
    await restoreNote({ noteId });
  };

  const handleDelete = async (noteId: Id<"notes">) => {
    await deleteNote({ noteId });
  };

  return (
    <div className="p-2">
      {/* Header and Warning banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-1 items-center gap-2 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Notes in trash will be permanently deleted after 30 days. Restore
            them to keep them.
          </span>
        </div>

        {notes && notes.length > 0 && (
          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to permanently delete all notes in the trash? This action cannot be undone.",
                )
              ) {
                deleteAllTrashedNotes();
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20 font-medium text-sm whitespace-nowrap cursor-pointer"
          >
            <Trash2 className="w-4 h-4 cursor-pointer" />
            Empty Trash
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes === undefined ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-card/40 border border-border/50 rounded-xl p-4 shadow-sm min-h-36"
            >
              <Skeleton className="w-full h-24 rounded-lg mb-3" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <div className="space-y-2 mt-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-3 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : notes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
            <Trash2 className="w-10 h-10 opacity-30" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="flex flex-col bg-card/40 border border-border/50 rounded-xl p-4 shadow-sm opacity-80 hover:opacity-100 transition-opacity min-h-36"
            >
              {/* Cover Image */}
              {note.coverImage && (
                <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-border/30">
                  <Image
                    src={note.coverImage}
                    alt="Cover"
                    width={200}
                    height={96}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="text-base font-semibold text-muted-foreground line-clamp-1 mb-2">
                {note.title || "Untitled Note"}
              </h2>

              {/* Body preview */}
              <div
                className="text-sm text-muted-foreground/60 leading-relaxed max-h-24 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1"
                dangerouslySetInnerHTML={{ __html: note.body }}
              />

              {/* Footer */}
              <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-border/20">
                {/* Days remaining */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground/50">Trashed:</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`px-2 py-1 rounded-lg font-medium ${
                        getDaysRemaining(note.deletedAt) &&
                        getDaysRemaining(note.deletedAt)! <= 7
                          ? "bg-red-500/20 text-red-400"
                          : getDaysRemaining(note.deletedAt) &&
                              getDaysRemaining(note.deletedAt)! <= 14
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {getDaysRemaining(note.deletedAt) !== null
                        ? `${getDaysRemaining(note.deletedAt)} day${getDaysRemaining(note.deletedAt) === 1 ? "" : "s"} left`
                        : "Calculating..."}
                    </div>
                  </div>
                </div>

                {/* Created date */}
                <p className="text-xs text-muted-foreground/50">
                  {formatDateTime(note.createdAt)}
                </p>

                {/* Action buttons */}
                <div className="flex gap-2 items-center">
                  {/* Restore */}
                  <button
                    onClick={() => handleRestore(note._id)}
                    title="Restore note"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer flex-1 justify-center text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>

                  {/* Delete permanently */}
                  <button
                    onClick={() => handleDelete(note._id)}
                    title="Delete permanently"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex-1 justify-center text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
