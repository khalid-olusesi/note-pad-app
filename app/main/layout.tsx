import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View and manage all your notes in one place. Search, filter, and organize your thoughts with KhalNote.",
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
