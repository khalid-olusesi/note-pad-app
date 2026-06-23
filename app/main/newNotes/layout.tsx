import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "New Note",
  description:
    "Create a new note in KhalNote. Write, format, tag, and set a reminder — all in one place.",
};

export default function NewNotesLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
