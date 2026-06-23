import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Support Dashboard",
  description: "View and manage all support requests.",
};

export default function AdminSupportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage support messages</p>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
