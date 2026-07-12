"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Trash2, Copy, Tags, MoreHorizontal } from "lucide-react";
import { useState, useRef } from "react";

type Note = {
  _id: string;
  title: string;
  body: string;
  coverImage?: string;
  isFavorite?: boolean;
  tag?: string;
};

type NoteCardMenuProps = {
  note: Note;
  onFavorite: (noteId: string) => void;
  onTrash: (noteId: string) => void;
  onDuplicate: (noteId: string) => void;
  onChangeTag: (noteId: string, tag: string) => void;
};

const TAGS = ["Ideas", "Study", "Personal", "Work", "Others"];

export default function NoteCardMenu({
  note,
  onFavorite,
  onTrash,
  onDuplicate,
  onChangeTag,
}: NoteCardMenuProps) {
  const [open, setOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const editTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          render={
            <button
              className="hover:text-foreground transition-colors cursor-pointer p-1 rounded-md hover:bg-muted/50"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
        />
          <DropdownMenuContent align="end" sideOffset={4} className="[&_[data-slot=dropdown-menu-item]]:transition-colors">
          <DropdownMenuItem
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen(false);
              setTimeout(() => setTagDialogOpen(true), 0);
            }}
          >
            <Tags className="w-4 h-4" />
            Change Tag
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen(false);
              onFavorite(note._id);
            }}
          >
            <Star
              className={`w-4 h-4 ${note.isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`}
            />
            {note.isFavorite ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen(false);
              setTimeout(() => onDuplicate(note._id), 0);
            }}
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen(false);
              setTimeout(() => setTrashOpen(true), 0);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Move to Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Trash Confirmation Dialog */}
      <AlertDialog open={trashOpen} onOpenChange={setTrashOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move this note to the Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to move this note to trash?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onTrash(note._id);
                setTrashOpen(false);
              }}
            >
              Move to Trash
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Tag Dialog */}
      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="inset-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm h-auto max-h-[calc(100%-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change Tag</DialogTitle>
            <DialogDescription>
              Select a new tag for this note.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap gap-2 py-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onChangeTag(note._id, tag);
                  setTagDialogOpen(false);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  note.tag === tag
                    ? "bg-purple-600 text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
