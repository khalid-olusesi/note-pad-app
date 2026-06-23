import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "AI Chat",
  description:
    "Chat with your notes. Ask questions and let KhalNote AI surface what you've forgotten.",
};

export default function AiChatLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
