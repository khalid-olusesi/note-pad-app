import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Log in to KhalNote to access your personal notes, reminders, and AI-powered second brain.",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
