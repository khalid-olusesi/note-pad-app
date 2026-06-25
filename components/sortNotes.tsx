import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function sortNotesList(notes: any[], sortBy: string) {
  if (!notes) return [];
  return [...notes].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return b.createdAt - a.createdAt;
      case "oldest":
        return a.createdAt - b.createdAt;
      case "a-z":
        return (a.title || "Untitled Note").localeCompare(b.title || "Untitled Note");
      case "z-a":
        return (b.title || "Untitled Note").localeCompare(a.title || "Untitled Note");
      default:
        return 0;
    }
  });
}

interface SortNotesProps {
  sortBy: string;
  setSortBy: (val: string) => void;
}

export default function SortNotes({ sortBy, setSortBy }: SortNotesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-3 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/20 px-3 py-2 text-sm text-muted-foreground cursor-pointer transition-colors hover:bg-muted/30">
        {sortBy === "latest" && "Latest First"}
        {sortBy === "oldest" && "Oldest First"}
        {sortBy === "a-z" && "A-Z"}
        {sortBy === "z-a" && "Z-A"}

        <ArrowUpDown className="w-4 h-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSortBy("latest")}>
          Latest First
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setSortBy("oldest")}>
          Oldest First
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setSortBy("a-z")}>
          A-Z
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setSortBy("z-a")}>
          Z-A
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
