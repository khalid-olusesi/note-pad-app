import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Edit,
  Image as ImageIcon,
  Link as LinkIcon,
  SquareCheck,
  Notebook,
  Grid3X3,
  ChevronDown,
  Highlighter,
  Type,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useEffect } from "react";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
type Note = {
  _id: string;
  title: string;
  body: string;
  coverImage?: string;
};

type editNoteProps = {
  note: Note;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ToolButtonProps = {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
};

const ToolButton = ({ onClick, active, children }: ToolButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={`h-7 w-7 hover:bg-muted/50 ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}
  >
    {children}
  </Button>
);

const Divider = () => <div className="w-px h-5 bg-border mx-1" />;

// Toolbar

function Toolbar({ editor }: { editor: Editor }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  if (!editor) return null;

  const colors = [
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#9333ea",
    "#ec4899",
    "#f97316",
  ];
  const highlightColors = [
    "#fef08a",
    "#fbbf24",
    "#fb923c",
    "#f87171",
    "#f0abfc",
    "#c084fc",
    "#a78bfa",
    "#93c5fd",
    "#67e8f9",
    "#86efac",
  ];

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
    setShowImageInput(false);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    if (!showLinkInput) {
      setLinkUrl(editor.getAttributes("link").href || "");
    }
  };

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput);
    setShowLinkInput(false);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setImageUrl("");
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const isActive = (type: string, options?: Record<string, unknown>) => {
    if (type === "paragraph" && options?.textAlign) {
      return editor.isActive("paragraph", options);
    }
    return editor.isActive(type, options);
  };

  return (
    <div className="flex flex-col gap-1 p-2 bg-[#0c0c0e] rounded-t-xl border-b border-border/50 relative">
      {/* Row 1 */}
      <div className="flex flex-wrap items-center gap-0.5">
        <Button
          variant="ghost"
          className="h-8 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          Paragraph <ChevronDown className="w-3 h-3 ml-2 opacity-70" />
        </Button>

        <Divider />

        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={isActive("underline")}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={isActive("strike")}
        >
          <Strikethrough className="w-4 h-4" />
        </ToolButton>

        <Divider />

        <div className="flex items-center hover:bg-muted/30 rounded-md">
          <ToolButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={isActive("bulletList")}
          >
            <List className="w-4 h-4" />
          </ToolButton>
          <ChevronDown className="w-3 h-3 text-muted-foreground cursor-pointer mr-1" />
        </div>

        <div className="flex items-center hover:bg-muted/30 rounded-md">
          <ToolButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={isActive("orderedList")}
          >
            <ListOrdered className="w-4 h-4" />
          </ToolButton>
          <ChevronDown className="w-3 h-3 text-muted-foreground cursor-pointer mr-1" />
        </div>

        <div className="flex items-center hover:bg-muted/30 rounded-md">
          <ToolButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={isActive("taskList")}
          >
            <SquareCheck className="w-4 h-4" />
          </ToolButton>
          <ChevronDown className="w-3 h-3 text-muted-foreground cursor-pointer mr-1" />
        </div>

        <Divider />

        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive("paragraph", { textAlign: "left" })}
        >
          <AlignLeft className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive("paragraph", { textAlign: "center" })}
        >
          <AlignCenter className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive("paragraph", { textAlign: "right" })}
        >
          <AlignRight className="w-4 h-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive("paragraph", { textAlign: "justify" })}
        >
          <AlignJustify className="w-4 h-4" />
        </ToolButton>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap items-center gap-0.5 pl-1 relative">
        {/* Text Color Picker */}
        <div className="relative">
          <div
            className="flex items-center hover:bg-muted/30 rounded-md cursor-pointer"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <ToolButton onClick={() => {}} active={false}>
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Type className="w-4 h-4" />
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
              </div>
            </ToolButton>
            <ChevronDown className="w-3 h-3 text-muted-foreground cursor-pointer mr-1" />
          </div>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1e] border border-border rounded-lg p-3 grid grid-cols-5 gap-3 z-50 w-fit shadow-lg">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-125 transition-all hover:border-white cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title={color}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight Color Picker */}
        <div className="relative">
          <div
            className="flex items-center hover:bg-muted/30 rounded-md cursor-pointer"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          >
            <ToolButton onClick={() => {}} active={isActive("highlight")}>
              <div className="flex flex-col items-center justify-center gap-0.5">
                <Highlighter className="w-4 h-4" />
                <div className="w-3 h-0.5 bg-foreground rounded-full"></div>
              </div>
            </ToolButton>
            <ChevronDown className="w-3 h-3 text-muted-foreground cursor-pointer mr-1" />
          </div>

          {showHighlightPicker && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1e] border border-border rounded-lg p-3 grid grid-cols-5 gap-3 z-50 w-fit shadow-lg">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-125 transition-all hover:border-white cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setShowHighlightPicker(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  title={color}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Link Tool */}
        <div className="relative">
          <ToolButton onClick={toggleLinkInput} active={isActive("link")}>
            <LinkIcon className="w-4 h-4" />
          </ToolButton>

          {showLinkInput && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1e] border border-border rounded-lg p-2 z-50 flex items-center gap-2 shadow-lg w-72">
              <input
                type="text"
                placeholder="Enter URL (e.g. https://...)"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="flex-1 bg-background text-sm px-2 py-1.5 rounded border border-border outline-none focus:border-purple-500 text-foreground"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (linkUrl.trim()) {
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: linkUrl })
                        .run();
                    } else {
                      editor.chain().focus().unsetLink().run();
                    }
                    setShowLinkInput(false);
                  } else if (e.key === "Escape") {
                    setShowLinkInput(false);
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (linkUrl.trim()) {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: linkUrl })
                      .run();
                  } else {
                    editor.chain().focus().unsetLink().run();
                  }
                  setShowLinkInput(false);
                }}
                size="sm"
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Image Tool */}
        <div className="relative">
          <ToolButton onClick={toggleImageInput} active={isActive("image")}>
            <ImageIcon className="w-4 h-4" />
          </ToolButton>

          {showImageInput && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1e] border border-border rounded-lg p-2 z-50 flex items-center gap-2 shadow-lg w-72">
              <input
                type="text"
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-background text-sm px-2 py-1.5 rounded border border-border outline-none focus:border-purple-500 text-foreground"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (imageUrl.trim()) {
                      editor.chain().focus().setImage({ src: imageUrl }).run();
                    }
                    setShowImageInput(false);
                  } else if (e.key === "Escape") {
                    setShowImageInput(false);
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  if (imageUrl.trim()) {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                  }
                  setShowImageInput(false);
                }}
                size="sm"
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              >
                Add
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center hover:bg-muted/30 rounded-md">
          <ToolButton onClick={insertTable} active={isActive("table")}>
            <Grid3X3 className="w-4 h-4" />
          </ToolButton>
          <ChevronDown className="w-3 h-3 text-muted-foreground cursor-pointer mr-1" />
        </div>

        <Divider />

        <ToolButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
        >
          <Undo className="w-4 h-4" />
        </ToolButton>

        <ToolButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
        >
          <Redo className="w-4 h-4" />
        </ToolButton>
      </div>
    </div>
  );
}

// NoteEditor

function NoteEditor({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/50 bg-background/50">
      <Toolbar editor={editor} />
      <div
        className="
    flex-1
    overflow-y-auto
    p-4
    cursor-text
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default function EditNote({
  note,
  open: controlledOpen,
  onOpenChange,
}: editNoteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const updateNote = useMutation(api.notes.updateNotes);
  const [title, setTitle] = useState(note.title);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start writing something meaningful...",
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: note.body,
    editorProps: {
      attributes: {
        class: "min-h-[150px] p-3 text-sm focus:outline-none",
      },
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) {
      setTitle(note.title);
      editor?.commands.setContent(note.body);
    }
  }, [open, note, editor]);

  if (!editor) return;

  async function handleEdit() {
    await updateNote({
      noteId: note._id as Id<"notes">,
      title,
      body: editor.getHTML(),
      coverImage: note.coverImage,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="hover:text-foreground flex items-center transition-colors cursor-pointer">
            <Edit className="w-4 h-4" />
          </button>
        }
      />
      <DialogContent
        className="
          p-0
    border-0
    rounded-none
    w-screen
   h-dvh
    max-w-none
    max-h-none
    flex
    flex-col
    overflow-hidden
    sm:p-4
    sm:h-auto
    sm:max-w-3xl
    sm:rounded-xl
  "
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col h-full min-h-0">
          <div className="flex items-center gap-3 mt-2 shrink-0">
            <div className="text-purple-500 flex items-center justify-center rounded-lg bg-purple-950 w-7 h-7">
              <Notebook className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-lg font-semibold">Edit Note</h1>
          </div>

          <form className="shrink-0">
            <input
              className="w-full border-b outline-0 p-2 text-sm font-medium"
              type="text"
              placeholder="Add a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between py-2 shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Reminder</span>
            </div>
            <button
              type="button"
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                reminderEnabled ? "bg-purple-600" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                  reminderEnabled ? "translate-x-4.5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {reminderEnabled && (
            <div className="flex gap-2 items-center shrink-0">
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="flex-1 bg-background text-sm px-2 py-1.5 rounded border border-border outline-none focus:border-purple-500 text-foreground"
              />
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="flex-1 bg-background text-sm px-2 py-1.5 rounded border border-border outline-none focus:border-purple-500 text-foreground"
              />
            </div>
          )}

          <div className="flex-1 min-h-0 px-4">
            <NoteEditor editor={editor} />
          </div>

          <div className="border shrink-0" />

          <div
            className="
    sticky
    bottom-0
    bg-background
    border-t
    px-4
    py-3
    flex
    justify-end
    gap-3
"
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
              onClick={async () => {
                await handleEdit();
                window.dispatchEvent(new Event("note-saved"));
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
