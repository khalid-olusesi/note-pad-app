"use client";

import { Search, X } from "lucide-react";
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
    const queryString = params.toString();
    if (pathname !== "/main") {
      router.push(queryString ? `/main?${queryString}` : "/main");
    } else {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    }
  };

  return (
    <div className="relative w-full max-w-full transition-all duration-300 ease-in-out z-50">
      <div className="relative flex items-center bg-muted/20 hover:bg-muted/30 focus-within:bg-background/80 border border-border/80 rounded-[1.5rem] transition-all duration-300 shadow-sm">
        <Search className={`absolute left-4 size-4 transition-colors duration-300 ${term ? "text-purple-400" : "text-muted-foreground"}`} />
        <Input
          type="search"
          placeholder="Search notes..."
          className="w-full pl-11 pr-10 bg-transparent border-none outline-none shadow-none focus-visible:ring-0 text-[15px] h-11 text-foreground placeholder:text-muted-foreground/70"
          value={term}
          onChange={handleInputChange}
        />
        {term && (
          <button
            type="button"
            onClick={() => handleInputChange({ target: { value: "" } } as any)}
            className="absolute right-3 p-2 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
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
