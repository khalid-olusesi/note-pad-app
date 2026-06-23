"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const notes = useQuery(api.notes.getNotesList);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {notes?.map(({ _id, title }) => (
        <div key={_id}>{title}</div>
      ))}
    </main>
  );
}
