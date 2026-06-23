import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2 } from "lucide-react";

type TrashNoteDialogProps = {
  noteId: string;
  onConfirm: (noteId: string) => void;
};

export function TrashNoteDialog({ noteId, onConfirm }: TrashNoteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button className="hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Move this note to the Trash?</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to move this note to trash?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={() => onConfirm(noteId)}>
            Move to Trash
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
