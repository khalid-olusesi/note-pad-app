import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 selection:bg-purple-500/30 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />

      <div className="absolute top-5 left-5 z-10">
        <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors cursor-pointer text-white">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Link>
      </div>

      <div className="w-full max-w-sm mx-auto relative z-10">{children}</div>
    </div>
  );
}
