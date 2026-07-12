import { Skeleton } from "@/components/ui/skeleton";

export default function ChatLoading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-57px)] w-full max-w-3xl mx-auto px-4 md:px-0">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <Skeleton className="w-9 h-9 rounded-xl" />
        <Skeleton className="w-9 h-9 rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 py-6 flex flex-col gap-5">
        <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-sm" />
        </div>
        <div className="flex gap-3 max-w-[85%]">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-20 w-full max-w-md rounded-2xl rounded-tl-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <Skeleton className="h-10 w-36 rounded-2xl rounded-tr-sm" />
        </div>
        <div className="flex gap-3 max-w-[85%]">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-24 w-full max-w-lg rounded-2xl rounded-tl-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Input bar skeleton */}
      <div className="pt-3 border-t border-border/50">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </div>
  );
}
