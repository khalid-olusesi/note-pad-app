import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your free KhalNote account. Start capturing notes, setting reminders, and organizing your thoughts in seconds.",
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
