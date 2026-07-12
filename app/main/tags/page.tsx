"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tag, Star, LayoutGrid, List } from "lucide-react";
import SortNotes, { sortNotesList } from "@/components/sortNotes";
import EditNote from "@/components/ui/edit";
import { Skeleton } from "@/components/ui/skeleton";
import NoteCardMenu from "@/components/ui/note-card-menu";
import { getRelativeTime, wasEdited } from "@/lib/time-utils";

const cardThemes = [
  {
    title: "text-purple-400",
    pillBg: "bg-purple-500/10",
    pillText: "text-purple-400",
    tag: "Ideas",
  },
  {
    title: "text-blue-400",
    pillBg: "bg-blue-500/10",
    pillText: "text-blue-400",
    tag: "Study",
  },
  {
    title: "text-green-400",
    pillBg: "bg-green-500/10",
    pillText: "text-green-400",
    tag: "Personal",
  },
  {
    title: "text-yellow-500",
    pillBg: "bg-yellow-500/10",
    pillText: "text-yellow-500",
    tag: "Work",
  },
  {
    title: "text-red-400",
    pillBg: "bg-red-500/10",
    pillText: "text-red-400",
    tag: "Health",
  },
  {
    title: "text-orange-400",
    pillBg: "bg-orange-500/10",
    pillText: "text-orange-400",
    tag: "Others",
  },
];

type Note = {
  _id: string;
  title: string;
  body: string;
  coverImage?: string;
  isFavorite?: boolean;
  tag?: string;
  createdAt: number;
  updatedAt?: number;
};

export default function TagsPage() {
  const notes = useQuery(api.notes.getNotesList);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("note-view-mode");
    if (saved === "grid" || saved === "list") {
      setViewMode(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("note-view-mode", mode);
  };

  const favorite = useMutation(api.notes.toggleFavorite).withOptimisticUpdate(
    (localStore, args) => {
      const existingNotes = localStore.getQuery(api.notes.getNotesList);
      if (existingNotes !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        localStore.setQuery(
          api.notes.getNotesList,
          {},
          existingNotes.map((n: any) =>
            n._id === args.noteId ? { ...n, isFavorite: !n.isFavorite } : n,
          ),
        );
      }
    },
  );
  const trash = useMutation(api.notes.moveToTrash).withOptimisticUpdate(
    (localStore, args) => {
      const existingNotes = localStore.getQuery(api.notes.getNotesList);
      if (existingNotes !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        localStore.setQuery(
          api.notes.getNotesList,
          {},
          existingNotes.filter((n: any) => n._id !== args.noteId),
        );
      }
    },
  );
  const duplicate = useMutation(api.notes.duplicateNote);
  const changeTag = useMutation(api.notes.changeTag);

  function handleFavorite(noteId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    favorite({ noteId: noteId as any });
  }

  function handleTrash(noteId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trash({ noteId: noteId as any });
  }

  function handleDuplicate(noteId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    duplicate({ noteId: noteId as any });
  }

  function handleChangeTag(noteId: string, tag: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changeTag({ noteId: noteId as any, tag });
  }

  function handleCardClick(noteId: string) {
    setEditingNoteId(noteId);
  }

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

  // Map notes to include their derived tag
  const notesWithTags = notes
    ? notes.map((note) => ({
        ...note,
        theme: cardThemes.find((t) => t.tag === note.tag) || cardThemes[0],
      }))
    : undefined;

  // Filter by tag first
  const filteredNotes =
    selectedTag && notesWithTags
      ? notesWithTags.filter((n) => n.tag === selectedTag)
      : notesWithTags;

  // Then sort
  const sortedNotes = filteredNotes
    ? sortNotesList(filteredNotes, sortBy)
    : undefined;

  // Unique tags for the filter buttons
  const uniqueTags = Array.from(new Set(cardThemes.map((t) => t.tag)));

  // Find the currently editing note
  const editingNote = useMemo(() => {
    if (!editingNoteId || !notes) return null;
    return (notes as Note[]).find((n) => n._id === editingNoteId) || null;
  }, [editingNoteId, notes]);

  return (
    <>
      <div className="mb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="text-blue-500 flex items-center justify-center rounded-lg bg-blue-500/10 w-8 h-8">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">Tags</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {sortedNotes ? (
                    `${sortedNotes.length} note${sortedNotes.length === 1 ? "" : "s"}${selectedTag ? ` tagged "${selectedTag}"` : " in total"}`
                  ) : (
                    <Skeleton className="w-24 h-4" />
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4">
            <SortNotes sortBy={sortBy} setSortBy={setSortBy} />
            <div className="border border-border bg-muted/20 rounded-2xl flex p-1 gap-1 items-center w-fit">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-purple-600 text-white shadow-sm" : "hover:bg-muted text-muted-foreground"}`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-purple-600 text-white shadow-sm" : "hover:bg-muted text-muted-foreground"}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            selectedTag === null
              ? "bg-foreground text-background"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          All
        </button>
        {uniqueTags.map((tag) => {
          const theme = cardThemes.find((t) => t.tag === tag)!;
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? `${theme.pillBg} ${theme.pillText} ring-1 ring-current`
                  : `bg-muted hover:bg-muted/80 text-muted-foreground`
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2"
            : "flex flex-col gap-3 p-2"
        }
      >
        {sortedNotes === undefined ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex bg-card/40 border border-border/50 rounded-xl p-4 shadow-sm ${
                viewMode === "grid"
                  ? "flex-col min-h-40 h-auto"
                  : "flex-col md:flex-row gap-5 items-start md:items-center"
              }`}
            >
              {viewMode === "list" && (
                <Skeleton className="w-full md:w-24 h-20 rounded-lg shrink-0" />
              )}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-6 w-1/2" />
                    {viewMode === "grid" && (
                      <Skeleton className="w-5 h-5 rounded-full" />
                    )}
                  </div>
                  {viewMode === "grid" && (
                    <Skeleton className="w-full h-24 rounded-lg mb-3" />
                  )}
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
                {viewMode === "grid" && (
                  <div className="mt-4 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                )}
              </div>
              <div
                className={`flex justify-between items-center ${
                  viewMode === "grid"
                    ? "mt-3 mb-0"
                    : "w-full md:w-auto md:flex-col md:items-end gap-3 mt-4 md:mt-0 shrink-0 md:border-l border-border/30 md:pl-5 pt-3 md:pt-0"
                }`}
              >
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-3">
                  <Skeleton className="w-5 h-5 rounded-md" />
                  <Skeleton className="w-5 h-5 rounded-md" />
                  <Skeleton className="w-5 h-5 rounded-md" />
                </div>
              </div>
            </div>
          ))
        ) : sortedNotes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
            <Tag className="w-10 h-10 opacity-30" />
            <p className="text-sm">No notes found for this tag</p>
          </div>
        ) : (
          sortedNotes.map((note) => {
            const theme =
              cardThemes.find((t) => t.tag === note.tag) || cardThemes[0];
            const rightColumnClass =
              viewMode === "grid"
                ? "mt-3 mb-0"
                : "w-full sm:w-auto sm:flex-row sm:items-center justify-between gap-2 mt-3 sm:mt-0 shrink-0 sm:border-l border-border/30 sm:pl-5 pt-3 sm:pt-0";
            return (
              <div
                key={note._id}
                onClick={() => handleCardClick(note._id)}
                className={`flex bg-card/40 border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                  viewMode === "grid" ? "flex-col min-h-32 h-auto" : "flex-col md:flex-row gap-4 items-start md:items-center"
                }`}
              >
                {viewMode === "list" && note.coverImage && (
                  <div className="w-full sm:w-20 h-28 sm:h-16 rounded-lg overflow-hidden border border-border/30 shrink-0 mb-2 sm:mb-0">
                    <img
                      src={note.coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between mb-1.5">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <h2
                          className={`text-sm sm:text-base font-semibold tracking-wide ${theme.title} line-clamp-1 pr-2`}
                        >
                          {note.title || "Untitled Note"}
                        </h2>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {note.body ? note.body.replace(/<[^>]+>/g, "") : "No preview available"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {viewMode === "grid" ? null : (
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${theme.pillBg} ${theme.pillText}`}
                          >
                            {note.tag || "Ideas"}
                          </span>
                        )}
                        {viewMode === "grid" && (
                          <Star
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(note._id);
                            }}
                            className={
                              note.isFavorite
                                ? "w-5 h-5 text-yellow-400 fill-yellow-400 cursor-pointer"
                                : "w-5 h-5 text-muted-foreground/70 hover:text-foreground cursor-pointer"
                            }
                          />
                        )}
                      </div>
                    </div>
                    {viewMode === "grid" && note.coverImage && (
                      <div className="w-full h-24 rounded-lg overflow-hidden mb-3 border border-border/30">
                        <img
                          src={note.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).tagName.toLowerCase() ===
                          "input"
                        ) {
                          e.stopPropagation();
                        }
                      }}
                      className={`text-xs text-muted-foreground leading-relaxed tiptap-content ${viewMode === "list" ? "max-h-12" : "max-h-16"} overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden`}
                      dangerouslySetInnerHTML={{ __html: note.body }}
                    />
                  </div>
                  {viewMode === "grid" && (
                    <div className="mt-3 mb-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${theme.pillBg} ${theme.pillText}`}
                      >
                        {note.tag || "Ideas"}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={"flex flex-col gap-2 text-xs text-muted-foreground/70 " + rightColumnClass}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="whitespace-nowrap text-[11px] sm:text-xs">
                      {formatDateTime(note.createdAt)}
                    </p>
                    {wasEdited(note.createdAt, note.updatedAt) && (
                      <p className="text-[10px] text-muted-foreground/50 whitespace-nowrap">
                        Edited {getRelativeTime(note.updatedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    {viewMode === "list" && (
                      <Star
                        onClick={() => handleFavorite(note._id)}
                        className={
                          note.isFavorite
                            ? "w-4 h-4 shrink-0 text-yellow-500 fill-yellow-500 cursor-pointer"
                            : "w-4 h-4 shrink-0 cursor-pointer text-muted-foreground/60 hover:text-foreground"
                        }
                      />
                    )}
                    <NoteCardMenu
                      note={note}
                      onFavorite={handleFavorite}
                      onTrash={handleTrash}
                      onDuplicate={handleDuplicate}
                      onChangeTag={handleChangeTag}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Controlled EditNote dialog */}
      {editingNote && (
        <EditNote
          key={editingNote._id}
          note={editingNote}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingNoteId(null);
          }}
        />
      )}
    </>
  );
}
