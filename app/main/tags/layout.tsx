import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tags",
  description:
    "Browse your notes by tag. Organize and filter with Work, Personal, Study, Ideas and more in KhalNote.",
};

export default function TagsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
