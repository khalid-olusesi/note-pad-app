import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find guides, tutorials, and answers to frequently asked questions about KhalNote.",
};

export default function HelpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
