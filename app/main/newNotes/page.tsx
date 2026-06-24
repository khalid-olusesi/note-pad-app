"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
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
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useNoteContext } from "./ClientLayout";

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
  Images,
  Image as ImageIcon,
  Link as LinkIcon,
  SquareCheck,
  Check,
  Notebook,
  Grid3X3,
  ChevronDown,
  Highlighter,
  Type,
} from "lucide-react";

// Component definitions
interface ToolButtonProps {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}

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
  const [showParagraphMenu, setShowParagraphMenu] = useState(false);

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
    setShowParagraphMenu(false);
    if (!showLinkInput) {
      setLinkUrl(editor.getAttributes("link").href || "");
    }
  };

  const toggleImageInput = () => {
    setShowImageInput(!showImageInput);
    setShowLinkInput(false);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowParagraphMenu(false);
    setImageUrl("");
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const getParagraphLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    return "Paragraph";
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
        <div className="relative">
          <Button
            variant="ghost"
            type="button"
            className="h-8 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowParagraphMenu(!showParagraphMenu);
            }}
          >
            {getParagraphLabel()}{" "}
            <ChevronDown className="w-3 h-3 ml-2 opacity-70" />
          </Button>

          {showParagraphMenu && (
            <div className="absolute top-full left-0 mt-1 bg-[#1a1a1e] border border-border rounded-lg p-2 z-50 w-32 shadow-lg">
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted/50 font-medium transition-colors cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setParagraph().run();
                  setShowParagraphMenu(false);
                }}
              >
                Paragraph
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted/50 font-semibold transition-colors cursor-pointer text-lg"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setHeading({ level: 1 }).run();
                  setShowParagraphMenu(false);
                }}
              >
                H1
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted/50 transition-colors cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setHeading({ level: 2 }).run();
                  setShowParagraphMenu(false);
                }}
              >
                H2
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted/50 text-xs transition-colors cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setHeading({ level: 3 }).run();
                  setShowParagraphMenu(false);
                }}
              >
                H3
              </button>
            </div>
          )}
        </div>

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
    <div className="overflow-hidden border border-border/50 rounded-xl bg-background/50 shadow-sm">
      <Toolbar editor={editor} />
      <div className="cursor-text p-2" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// Page

import { Suspense } from "react";

function NewNotesContent() {
  const searchParams = useSearchParams();
  const noteIdFromUrl = searchParams.get("noteId");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [noteId, setNoteId] = useState<string | null>(noteIdFromUrl);

  useEffect(() => {
    setNoteId(noteIdFromUrl);
  }, [noteIdFromUrl]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const createNote = useMutation(api.notes.createNote).withOptimisticUpdate((localStore, args) => {
    const existingNotes = localStore.getQuery(api.notes.getNotesList);
    if (existingNotes !== undefined) {
      const newNote = {
        _id: `temp_${Date.now()}` as any,
        ...args,
        createdAt: Date.now(),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      localStore.setQuery(api.notes.getNotesList, {}, [newNote, ...existingNotes] as any);
    }
  });
  const updateNotesMut = useMutation(api.notes.updateNotes).withOptimisticUpdate((localStore, args) => {
    const existingNotes = localStore.getQuery(api.notes.getNotesList);
    if (existingNotes !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      localStore.setQuery(api.notes.getNotesList, {}, existingNotes.map((n: any) => 
        n._id === args.noteId ? { ...n, ...args, updatedAt: Date.now() } : n
      ));
    }
  });

  const CACHE_KEY = noteId ? `note_${noteId}` : "notepad_draft_new";

  // Helper to get initial content from cache
  const getInitialContent = () => {
    try {
      // First check note-specific cache
      if (noteId) {
        const cached = localStorage.getItem(`note_${noteId}`);
        if (cached) {
          const data = JSON.parse(cached);
          return data.body || "";
        }
      }
      // Then check new note draft cache
      const draftCached = localStorage.getItem("notepad_draft_new");
      if (draftCached) {
        const data = JSON.parse(draftCached);
        return data.body || "";
      }
    } catch (error) {
      console.error("Failed to get cached content:", error);
    }
    return "";
  };

  // STEP 0: Restore from localStorage immediately on mount (instant)
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        setTitle(data.title || "");
      }
    } catch (error) {
      console.error("Failed to restore from cache:", error);
    }
  }, []);

  // STEP 1: Fetch note from Convex if noteId exists (runs in background)
  const note = useQuery(
    api.notes.getNote,
    noteId ? { noteId: noteId as any } : "skip",
  );

  // STEP 2: Update cache and state when Convex returns data
  useEffect(() => {
    if (note?._id) {
      setNoteId(note._id);
      setTitle(note.title || "");
      // Update cache with server data
      if (CACHE_KEY) {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ title: note.title, body: note.body }),
        );
      }
    }
  }, [note, CACHE_KEY]);



  const autoSave = useCallback(async () => {
    if (!title.trim()) return;

    const bodyHTML = editor?.getHTML() || "";

    // Save to cache immediately
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ title, body: bodyHTML }),
      );
    } catch (error) {
      console.error("Failed to cache:", error);
    }

    setSaveStatus("saving");
    try {
      if (noteId) {
        // UPDATE existing note
        await updateNotesMut({
          noteId: noteId as any,
          title,
          body: bodyHTML,
        });
      } else if (editor) {
        // CREATE new note
        const id = await createNote({
          title,
          body: bodyHTML,
        });
        setNoteId(id);

        // Migrate draft cache to note-specific cache
        try {
          const draft = localStorage.getItem("notepad_draft_new");
          if (draft) {
            localStorage.removeItem("notepad_draft_new");
            localStorage.setItem(`note_${id}`, draft);
          }
        } catch (error) {
          console.error("Failed to migrate cache:", error);
        }

        // Update URL with new noteId so reload fetches this note
        window.history.replaceState(null, "", `?noteId=${id}`);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Autosave failed:", error);
      setSaveStatus("idle");
    }
  }, [title, noteId, createNote, updateNotesMut, CACHE_KEY]);

  const {
    coverImage,
    isFavorite,
    selectedTag,
    clearTrigger,
    isReminderOn,
    reminderDate,
    reminderTime: remTime,
  } = useNoteContext();

  async function handleSave() {
    if (!title.trim() || !editor) {
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    setSaveStatus("saving");

    let reminderTimestamp: number | undefined;
    if (isReminderOn && reminderDate) {
      const [hours, minutes] = remTime.split(":").map(Number);
      const combined = new Date(reminderDate);
      combined.setHours(hours, minutes, 0, 0);
      reminderTimestamp = combined.getTime();
    }

    const bodyHTML = editor.getHTML();
    const notePayload = {
      title,
      body: bodyHTML,
      coverImage: coverImage || undefined,
      isFavorite,
      tag: selectedTag,
      reminderEnabled: isReminderOn,
      reminderTime: reminderTimestamp,
    };

    try {
      if (noteId) {
        updateNotesMut({
          noteId: noteId as any,
          ...notePayload,
        });
        try {
          localStorage.removeItem(`note_${noteId}`);
        } catch (error) {}
      } else {
        createNote(notePayload).then((savedNoteId) => {
          try {
            if (savedNoteId) {
              localStorage.removeItem(`note_${savedNoteId}`);
            }
          } catch (error) {}
        });
      }

      try {
        localStorage.removeItem("notepad_draft_new");
        localStorage.removeItem(CACHE_KEY);
      } catch (error) {
        console.error("Failed to clear cache:", error);
      }

      window.dispatchEvent(new Event("note-saved"));
      router.push("/main");
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("idle");
    }
  }

  const getAutoSaveIntervalMs = () => {
    try {
      const saved = localStorage.getItem("notepadSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        if (typeof settings.autoSaveInterval === "number") {
          return settings.autoSaveInterval * 1000;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return 1500;
  };

  // Configure the editor with cached content
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
    content: getInitialContent(),
    editorProps: {
      attributes: {
        class: "min-h-[150px] p-3 text-sm focus:outline-none",
      },
    },
    onUpdate: () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(autoSave, getAutoSaveIntervalMs());
    },
  });

  const contentInitialized = useRef(false);

  // STEP 3: Restore editor content instantly from cache, then update from Convex
  useEffect(() => {
    if (!editor) return;

    if (CACHE_KEY && !contentInitialized.current) {
      try {
        // First: restore from localStorage instantly
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          if (data.body && data.body !== "<p></p>") {
            editor.commands.setContent(data.body);
            contentInitialized.current = true;
          }
        }
      } catch (error) {
        console.error("Failed to restore editor from cache:", error);
      }
    }

    // Second: if Convex has fresher data, update from it
    if (note?.body && !contentInitialized.current) {
      editor.commands.setContent(note.body);
      contentInitialized.current = true;
    }

    // If it's a new note without any cache/convex data, mark initialized
    if (!noteIdFromUrl && !contentInitialized.current) {
      contentInitialized.current = true;
    }
  }, [CACHE_KEY, note?.body, editor, noteIdFromUrl]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(autoSave, getAutoSaveIntervalMs()); // dynamic delay
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, autoSave]);

  useEffect(() => {
    if (clearTrigger > 0) {
      setTitle("");
      editor?.commands.setContent("");
      setNoteId(null);
      // Clear both draft and note-specific cache
      try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem("notepad_draft_new");
      } catch (error) {
        console.error("Failed to clear cache:", error);
      }
      // Reset URL to remove noteId parameter
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [clearTrigger, editor, CACHE_KEY]);

  if (!editor) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mt-6 ">
        <div className="text-purple-500 flex items-center justify-center rounded-lg bg-purple-950 w-8 h-8">
          <Notebook className="w-4 h-4" />
        </div>
        <h1 className="text-lg font-semibold">New Note</h1>
      </div>
      <form>
        <input
          className="w-full border-b outline-0 p-2 text-sm font-medium"
          type="text"
          placeholder="Add a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>

      <NoteEditor editor={editor} />

      <div className="introduction">
        <h2 className="text-lg font-semibold w-50 leading-8">
          Welcome to your new note!
        </h2>
        <p className="mt-3 text-muted-foreground text-sm">
          This is your space. Write anything you want.
        </p>
        <p className="mt-3 text-muted-foreground mb-3 text-sm">
          You can format text like in Microsoft Word.
        </p>

        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-bold text-foreground">Bold</span>,{" "}
            <span className="italic">italic</span>, and{" "}
            <span className="underline">underline</span> text
          </li>
          <li>
            Add <span className="text-purple-500">colors</span>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              Insert images
              <Images className="w-4 h-4" />
            </span>
          </li>
          <li>Create lists</li>
          <li>And more...</li>
        </ul>
      </div>

      <div className="border" />

      {/* Example to-do list */}
      <div className="second-intro">
        <h2 className="flex gap-2 text-lg font-semibold items-center">
          Example: To-do List <SquareCheck />
        </h2>

        {[
          { label: "Design the app", done: true },
          { label: "Implement features", done: true },
          { label: "Test everything", done: false },
          { label: "Deploy", done: false },
        ].map(({ label, done }) => (
          <div
            key={label}
            className="flex items-center text-muted-foreground text-sm gap-4 mt-2"
          >
            <div
              className={`${
                done ? "bg-purple-500" : "border-2 border-gray-600"
              } rounded h-4 w-4 flex items-center justify-center`}
            >
              {done && <Check className="h-3 w-3" />}
            </div>
            <p>{label}</p>
          </div>
        ))}

        <div className="flex flex-col sm:flex-row text-sm text-muted-foreground justify-between items-start sm:items-center gap-4 mt-6">
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <p>
              Words:{" "}
              {editor.getText().trim()
                ? editor.getText().trim().split(/\s+/).length
                : 0}
            </p>
            <p>Characters: {editor.getText().length}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            <Button
              type="button"
              className="cursor-pointer flex-1 sm:flex-none"
              variant="outline"
              onClick={() => router.push("/main")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="cursor-pointer flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleSave}
            >
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewNotesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewNotesContent />
    </Suspense>
  );
}
