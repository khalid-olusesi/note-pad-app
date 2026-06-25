"use client";

import { Search} from "lucide-react";
import { Input } from "./input";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function SearchInputContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [term, setTerm] = useState(initialQuery);

  // Sync state with URL parameter if it changes externally
  useEffect(() => {
    setTerm(initialQuery);
  }, [initialQuery]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTerm(value);
    handleSearchSubmit(value);
  }

  const handleSearchSubmit = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    if (pathname !== "/main") {
      router.push(`/main?${params.toString()}`);
    } else {
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-full max-w-sm focus-within:max-w-md transition-all duration-300 ease-in-out z-50">
      <div className="relative flex items-center bg-muted/20 hover:bg-muted/30 focus-within:bg-background/80 border border-border/80 rounded-xl transition-all duration-300 shadow-sm">
        <Search className={`absolute left-3 size-4 transition-colors duration-300 ${term ? "text-purple-400" : "text-muted-foreground"}`} />
        <Input
          type="search"
          placeholder="Search notes..."
          className="w-full pl-9 pr-8 bg-transparent border-none outline-none shadow-none focus-visible:ring-0 text-[15px] h-10 text-foreground placeholder:text-muted-foreground/70"
          value={term}
          onChange={handleInputChange}
        />
        {term && (
          <button
            onClick={() => handleInputChange({ target: { value: "" } } as any)}
            className="absolute right-3 p-0.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Clear search"
          >
          </button>
        )}
      </div>
    </div>
  );
}

export function SearchInput() {
  return (
    <Suspense fallback={<div className="h-10 bg-muted/20 border border-border/80 rounded-xl animate-pulse w-full max-w-sm"></div>}>
      <SearchInputContent />
    </Suspense>
  );
}
