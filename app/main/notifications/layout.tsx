import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "View your reminders and notifications. Stay on top of your tasks and notes in KhalNote.",
};

export default function NotificationsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
