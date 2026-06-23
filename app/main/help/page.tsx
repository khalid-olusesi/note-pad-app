"use client";

import { useState } from "react";
import {
  HelpCircle,
  Keyboard,
  BookOpen,
  ChevronDown,
  Copy,
  Check,
  Mail,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null);

  const faqs = [
    {
      question: "How do I create a new note?",
      answer:
        "Click the 'New Note' button in the sidebar or use the keyboard shortcut Ctrl+Alt+N. Start typing your note content and it will be automatically saved.",
    },
    {
      question: "How does autosave work?",
      answer:
        "Your notes are automatically saved to the database after 1.5 seconds of inactivity. You can change the autosave interval in Settings. All changes are also cached locally for instant visibility.",
    },
    {
      question: "Can I organize my notes with tags?",
      answer:
        "Yes! You can assign tags to notes like Work, Personal, Ideas, Study, and Health. Click on a tag in the sidebar to view all notes with that tag. You can also create custom tags.",
    },
    {
      question: "What is the Favorites feature?",
      answer:
        "Mark important notes as favorites to quickly access them. Your favorite notes are highlighted with a star icon and can be filtered from the Favorites section in the sidebar.",
    },
    {
      question: "How do I recover deleted notes?",
      answer:
        "Deleted notes go to the Trash folder. You can restore them by clicking the restore button. Notes in trash are permanently deleted after 30 days.",
    },
    {
      question: "Is there an offline mode?",
      answer:
        "Yes! Your notes are cached locally, so you can view and edit them offline. When you're back online, all changes will sync automatically.",
    },
    {
      question: "How do I change the theme?",
      answer:
        "Go to Settings > Appearance to choose between Light, Dark, or System theme. Your preference is saved automatically.",
    },
    {
      question: "Can I format my notes?",
      answer:
        "Absolutely! Use the formatting toolbar to add headings, bold, italic, underline, lists, code blocks, tables, and more. You can also insert images and links.",
    },
    {
      question: "How do I export my notes?",
      answer:
        "Go to Settings > Data Management > Export Notes to download all your notes as a JSON file that you can backup or import elsewhere.",
    },
    {
      question: "Is my data encrypted?",
      answer:
        "All your data is transmitted over HTTPS. We recommend using a strong password and enabling two-factor authentication for maximum security.",
    },
  ];

  const shortcuts = [
    { key: "Ctrl + Alt + N", action: "Create new note" },
    { key: "Ctrl + B", action: "Bold text" },
    { key: "Ctrl + I", action: "Italic text" },
    { key: "Ctrl + U", action: "Underline text" },
    { key: "Ctrl + Shift + X", action: "Strikethrough" },
    { key: "Ctrl + Z", action: "Undo" },
    { key: "Ctrl + Shift + Z", action: "Redo" },
    { key: "Ctrl + K", action: "Insert link" },
    { key: "Cmd + Enter", action: "Save note" },
    { key: "Escape", action: "Close modals" },
  ];

  const gettingStarted = [
    {
      step: 1,
      title: "Create Your First Note",
      description:
        "Click the 'New Note' button or press Ctrl+Alt+N. Start typing and your note will be automatically saved.",
    },
    {
      step: 2,
      title: "Add a Title",
      description:
        "Enter a title for your note at the top. Notes won't be saved to the database without a title, but they're cached locally.",
    },
    {
      step: 3,
      title: "Format Your Content",
      description:
        "Use the formatting toolbar to add headings, lists, images, tables, and more. Make your notes beautiful and organized.",
    },
    {
      step: 4,
      title: "Organize with Tags",
      description:
        "Add tags to categorize your notes. Use the sidebar to filter notes by tag and keep everything organized.",
    },
    {
      step: 5,
      title: "Mark as Favorite",
      description:
        "Click the star icon to mark important notes as favorites for quick access from the Favorites section.",
    },
    {
      step: 6,
      title: "Search and Find",
      description:
        "Use the search bar at the top to quickly find notes by title or content. Search results update in real-time.",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedShortcut(text);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedShortcut(null), 2000);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-semibold">Help & Documentation</h1>
          </div>
          <div className="text-muted-foreground text-sm">
            Learn how to use Notepad to its fullest
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-500" />
          Getting Started
        </h2>

        <div className="space-y-4">
          {gettingStarted.map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-4 bg-muted/30 rounded-lg"
            >
              <div className="shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-600 text-white text-sm font-semibold">
                  {item.step}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-orange-500" />
          Keyboard Shortcuts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shortcuts.map((shortcut, idx) => (
            <button
              key={idx}
              onClick={() => copyToClipboard(shortcut.key)}
              className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {shortcut.action}
                </span>
                {copiedShortcut === shortcut.key ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <kbd className="mt-2 px-2 py-1 bg-background border rounded text-xs font-semibold text-foreground inline-block">
                {shortcut.key}
              </kbd>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border rounded-lg overflow-hidden hover:border-muted-foreground/50 transition-colors"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <span className="font-medium text-left">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedFaq === idx && (
                <div className="px-4 py-3 bg-muted/20 border-t text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips & Tricks */}
      <div className="border rounded-lg p-5 space-y-4 bg-purple-500/5 border-purple-500/30">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-purple-500" />
          Pro Tips & Tricks
        </h2>

        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>
              <strong>Multiple note editing:</strong> Open multiple notes in
              different tabs to work on them simultaneously.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>
              <strong>Instant search:</strong> Use the search feature to quickly
              find notes. Results update as you type.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>
              <strong>Rich formatting:</strong> Try using headings, tables, and
              code blocks to structure your notes better.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>
              <strong>Reminders:</strong> Set reminders for important notes so
              you don't forget them.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>
              <strong>Sidebar collapse:</strong> Collapse the sidebar for more
              writing space on smaller screens.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-500 font-bold">•</span>
            <span>
              <strong>Dark mode:</strong> Enable dark mode in Settings for a
              comfortable writing experience at night.
            </span>
          </li>
        </ul>
      </div>

      {/* Contact Us */}
      <div className="border rounded-lg p-6 bg-purple-500/5 border-purple-500/30 text-center space-y-4">
        <h3 className="font-semibold text-lg">Contact Us</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Have questions, feedback, or need help? Reach out via email or check out our GitHub.
        </p>
        <div className="flex flex-col items-center gap-3">
          <a
            href="mailto:olusesikhalid43@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            olusesikhalid43@gmail.com
          </a>
          <a
            href="https://github.com/khalid-olusesi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Code2 className="w-4 h-4" />
            github.com/khalid-olusesi
          </a>
        </div>
      </div>
    </div>
  );
}
