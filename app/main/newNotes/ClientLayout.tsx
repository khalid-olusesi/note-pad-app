"use client";

import * as React from "react";
import { useState } from "react";
import { ReactNode } from "react";
import { CalendarIcon, ImageIcon, Trash2 } from "lucide-react";
import {
  Briefcase,
  User,
  Lightbulb,
  BookOpen,
  Folder,
  Star,
  Bell,
  Heart,
} from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createContext, useContext } from "react";

interface NoteContextType {
  coverImage: string;
  setCoverImage: (url: string) => void;
  isFavorite: boolean;
  setIsFavorite: (val: boolean) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  clearTrigger: number;
  setClearTrigger: (val: number | ((prev: number) => number)) => void;
  reminderDate: Date | undefined;
  setReminderDate: (date: Date | undefined) => void;
  reminderTime: string;
  setReminderTime: (time: string) => void;
  isReminderOn: boolean;
  setIsReminderOn: (val: boolean) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function useNoteContext() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NewNotesLayout");
  }
  return context;
}

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string) {
  // converts "14:30" → "2:30 PM"
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Category data

const categories = [
  { name: "Work", icon: Briefcase },
  { name: "Personal", icon: User },
  { name: "Ideas", icon: Lightbulb },
  { name: "Study", icon: BookOpen },
  { name: "Health", icon: Heart },
  { name: "Others", icon: Folder },
];

// DatePickerInput

function DatePickerInput() {
  const { reminderDate, setReminderDate, reminderTime, setReminderTime } = useNoteContext();
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(reminderDate);

  return (
    <div className="px-5 pb-5 ">
      <Popover open={open} onOpenChange={setOpen}>
        {/* The pill trigger */}
        <PopoverTrigger
          render={
            <button
              className="flex items-center justify-between w-full rounded-lg text-muted-foreground border px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
              aria-label="Pick date and time"
            >
              {/* Date */}
              <span className="whitespace-nowrap">
                {reminderDate ? formatDate(reminderDate) : "Pick a date"}
              </span>

              {/* Time */}
              <span className="whitespace-nowrap">{formatTime(reminderTime)}</span>

              {/* Calendar icon */}
              <CalendarIcon className="w-4 h-4 shrink-0 opacity-70" />
            </button>
          }
        />

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={reminderDate}
            month={month}
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              setReminderDate(selectedDate);
              setOpen(false);
            }}
          />

          {/* Time picker row inside the popover */}
          <div className="border-t px-4 py-3 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none border-none"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);

      // Try decreasing quality until under ~700KB (leaves headroom under 1MB doc limit)
      let q = quality;
      let dataUrl = canvas.toDataURL("image/jpeg", q);

      while (dataUrl.length > 700_000 && q > 0.3) {
        q -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", q);
      }

      resolve(dataUrl);
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function NoteOptions() {
  const { coverImage, setCoverImage, isFavorite, setIsFavorite, selectedTag, setSelectedTag, setClearTrigger, isReminderOn, setIsReminderOn } =
    useNoteContext();
  const selected = categories.find((c) => c.name === selectedTag) || categories[0];
  const SelectedIcon = selected.icon;

  function toggle() {
    setIsFavorite(!isFavorite);
  }

  function reminderToggle() {
    setIsReminderOn(!isReminderOn);
  }

  function handleDiscard() {
    setCoverImage("");
    setIsFavorite(false);
    setSelectedTag(categories[0].name);
    setIsReminderOn(false);
    setClearTrigger((prev) => prev + 1);
  }

  return (
    <div className="space-y-6 ">
      {/* Tag & Favourites */}
      <div className="border rounded-lg p-5">
        <p className="font-medium">Note options</p>

        <p className="mt-4 text-sm text-muted-foreground mb-2">Tag</p>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className={cn(buttonVariants({ variant: "outline" }))}>
                <SelectedIcon className="w-4 h-4 mr-2" />
                {selected.name}
              </button>
            }
          />

          <DropdownMenuContent>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <DropdownMenuItem
                  key={category.name}
                  onClick={() => setSelectedTag(category.name)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <hr className="mb-6 mt-6" />

        <div className="flex items-center justify-between text-sm">
          <p className="flex items-center gap-3">
            <Star className="w-4 h-4" />
            Add to favorites
          </p>

          <div
            onClick={toggle}
            className={
              isFavorite
                ? "flex items-center justify-end cursor-pointer transition rounded-lg bg-purple-500 w-10 h-6"
                : "flex items-center justify-start cursor-pointer rounded-lg border-2 transition w-10 h-6"
            }
          >
            <div className="rounded-full w-5 h-5 bg-white" />
          </div>
        </div>
      </div>

      {/* Reminders & Date picker */}
      <div className="border rounded-lg text-sm">
        <div className="flex justify-between items-center p-5">
          <p className="flex items-center gap-3">
            <Bell className="w-4 h-4" />
            Reminders
          </p>

          <div
            onClick={reminderToggle}
            className={
              isReminderOn
                ? "flex items-center justify-end cursor-pointer transition rounded-lg bg-purple-500 w-10 h-6"
                : "flex items-center justify-start cursor-pointer rounded-lg border-2 transition w-10 h-6"
            }
          >
            <div className="rounded-full w-5 h-5 bg-white" />
          </div>
        </div>

        <DatePickerInput />
      </div>

      <div className="text-sm border rounded-lg mt-6 overflow-hidden">
        <p className="mb-4 mt-5 ml-6 font-medium">Cover Image</p>
        <div className="flex justify-center items-center px-6 pb-6">
          {coverImage ? (
            <div className="relative w-full h-32 rounded-lg overflow-hidden group border border-border/50">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="h-30 w-full flex justify-center items-center flex-col border-dashed border-2 border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex justify-center gap-2 text-muted-foreground text-sm items-center flex-col">
                <ImageIcon className="w-8 h-8 text-muted-foreground/60" />
                <p>Upload Image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const compressed = await compressImage(file);
                    setCoverImage(compressed);
                  } catch (err) {
                    console.error("Image processing failed:", err);
                  }
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="mt-6 border rounded-lg text-muted-foreground p-6 text-sm">
        <h2 className=" text-white mb-4">Note Stats</h2>
        <p>Created</p>
        <p className="mb-4">{formatDate(new Date())} . {formatTime(new Date().toLocaleTimeString("en-US", { hour12: false }))}</p>
        <p>Updated</p>
        <p>{formatDate(new Date())} . {formatTime(new Date().toLocaleTimeString("en-US", { hour12: false }))}</p>
      </div>

      <div 
        onClick={handleDiscard}
        className="flex justify-center rounded-lg gap-4 text-sm text-red-600 border p-4 items-center cursor-pointer hover:bg-red-500/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> <p>Discard Note </p>
      </div>
    </div>
  );
}

// Layout

export default function NewNotesLayout({ children }: { children: ReactNode }) {
  const [coverImage, setCoverImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTag, setSelectedTag] = useState(categories[0].name);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(new Date());
  const [reminderTime, setReminderTime] = useState("10:00");
  const [isReminderOn, setIsReminderOn] = useState(false);

  return (
    <NoteContext.Provider
      value={{ coverImage, setCoverImage, isFavorite, setIsFavorite, selectedTag, setSelectedTag, clearTrigger, setClearTrigger, reminderDate, setReminderDate, reminderTime, setReminderTime, isReminderOn, setIsReminderOn }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] mt-[-20] gap-7">
        {/* Left — page content (editor) */}
        <div className="min-w-0">{children}</div>

        {/* Right — options sidebar */}
        <div className="lg:border-l-2 border-t-2 lg:border-t-0 pt-6 lg:pt-4 lg:p-4">
          <NoteOptions />
        </div>
      </div>
    </NoteContext.Provider>
  );
}
