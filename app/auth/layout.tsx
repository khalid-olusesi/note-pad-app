import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-[#09090b] text-zinc-100 selection:bg-purple-500/30 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[min(100%,420px)] mx-auto relative z-10">
        {children}
      </div>
    </div>
  );
}
