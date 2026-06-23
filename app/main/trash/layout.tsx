import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Trash",
  description:
    "View and restore deleted notes. Recover any note within 30 days before it's permanently removed from KhalNote.",
};

export default function TrashLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
