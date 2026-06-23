import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with KhalNote. Contact our support team for any issues, feature requests, or questions.",
};

export default function SupportLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
