import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Favorites",
  description:
    "Your starred notes — instantly accessible. Keep your most important thoughts at your fingertips in KhalNote.",
};

export default function FavoriteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
