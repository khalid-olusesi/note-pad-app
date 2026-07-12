"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Tag,
  Search,
  Star,
  Trash2,
  ArrowRight,
  NotebookPen,
  Sparkles,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0c0c10] text-zinc-100 font-sans selection:bg-violet-500/30">
      {/* Ambient background — fixed so it never causes scroll */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-45 left-[10%] w-130 h-130 rounded-full bg-violet-700/12 blur-[140px]" />
        <div className="absolute top-[30%] -right-20 w-95 h-95 rounded-full bg-fuchsia-700/10 blur-[120px]" />
        <div className="absolute bottom-[5%] left-[20%] w-75 h-75 rounded-full bg-indigo-700/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/6 bg-[#0c0c10]/75 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-linear-to-br from-violet-500 to-fuchsia-600">
              <NotebookPen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              KhalNote
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7 text-[13px] text-zinc-500">
            <Link
              href="#features"
              className="hover:text-zinc-200 transition-colors"
            >
              Features
            </Link>
            <Link href="#why" className="hover:text-zinc-200 transition-colors">
              Why KhalNote
            </Link>
            <Link href="#contact" className="hover:text-zinc-200 transition-colors">
              Contact Me
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/main">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white cursor-pointer h-8 px-4 rounded-lg text-xs font-medium transition-all">
                  Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-[13px] text-zinc-400 hover:text-white transition-colors hidden sm:block"
                >
                  Log in
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-white text-[#0c0c10] hover:bg-zinc-100 cursor-pointer h-8 px-4 rounded-lg text-xs font-semibold transition-all">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full">
        {/* ─── Hero ─── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-28">
          <div className="max-w-2xl">
            {/* eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8 text-[11px] font-medium text-violet-300 mb-8 tracking-wide uppercase">
              <Sparkles className="w-3 h-3" />
              Your personal second brain
            </div>

            <h1 className="text-[40px] sm:text-[54px] font-extrabold tracking-[-0.03em] leading-[1.08] mb-6 text-white">
              Write it down.
              <br />
              <span className="text-zinc-400 font-normal">Never lose it.</span>
            </h1>

            <p className="text-[15px] text-zinc-400 leading-[1.75] mb-10 max-w-xl">
              KhalNote is a private, fast, beautifully designed notepad. Capture
              thoughts, organize with tags, set reminders, and let AI surface
              what you've forgotten.
            </p>

            <div className="flex flex-wrap gap-3">
              {session ? (
                <Link href="/main">
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white h-11 px-7 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 cursor-pointer">
                    Open Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white h-11 px-7 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 cursor-pointer">
                      Start for free <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      className="h-11 px-7 rounded-xl text-sm border-white/10 bg-white/3 hover:bg-white/[0.07] text-zinc-300 hover:text-white transition-all cursor-pointer"
                    >
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <p className="text-xs text-zinc-600 mt-5">
              Free to use · No credit card needed
            </p>
          </div>
        </section>

        {/* ─── Divider ─── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* ─── Features ─── */}
        <section
          id="features"
          className="max-w-6xl mx-auto px-5 sm:px-8 py-24 scroll-mt-16"
        >
          <div className="mb-14">
            <p className="text-xs text-violet-400 uppercase tracking-widest font-semibold mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-md leading-tight">
              Everything you need.
              <br />
              Nothing you don't.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Tag,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
                border: "hover:border-violet-500/30",
                title: "Tags as folders",
                desc: "No rigid folder structure. Tag notes as Work, Study, Personal, or Ideas — one note can belong to multiple categories at once.",
              },
              {
                icon: Search,
                color: "text-sky-400",
                bg: "bg-sky-500/10",
                border: "hover:border-sky-500/30",
                title: "Instant search",
                desc: "Full-text search across every note in milliseconds. Never lose a thought again.",
              },
              {
                icon: Sparkles,
                color: "text-fuchsia-400",
                bg: "bg-fuchsia-500/10",
                border: "hover:border-fuchsia-500/30",
                title: "AI second brain",
                desc: 'Chat with your notes. Ask "what were my ideas last week?" and KhalNote AI reads your private notes to find the answer instantly.',
              },
              {
                icon: Bell,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
                border: "hover:border-amber-500/30",
                title: "Reminders",
                desc: "Set a date and time on any note. Get notified right inside the app when it matters.",
              },
              {
                icon: Star,
                color: "text-yellow-400",
                bg: "bg-yellow-500/10",
                border: "hover:border-yellow-500/30",
                title: "Favorites",
                desc: "Star your most-accessed notes to keep them instantly reachable from the sidebar.",
              },
              {
                icon: Trash2,
                color: "text-rose-400",
                bg: "bg-rose-500/10",
                border: "hover:border-rose-500/30",
                title: "Trash & recovery",
                desc: "Accidentally deleted something? Restore any note from your trash within 30 days.",
              },
            ].map(({ icon: Icon, color, bg, border, title, desc }) => (
              <div
                key={title}
                className={`group p-5 rounded-2xl border border-white/6 bg-white/2 ${border} hover:bg-white/4 transition-all duration-300`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-1.5">
                  {title}
                </h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Why section ─── */}
        <section
          id="why"
          className="max-w-6xl mx-auto px-5 sm:px-8 py-10 pb-24 scroll-mt-16"
        >
          <div className="rounded-2xl border border-white/[0.07] bg-white/2 p-8 sm:p-12 flex flex-col sm:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs text-violet-400 uppercase tracking-widest font-semibold mb-4">
                Why KhalNote?
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-5">
                Built for people who think fast.
              </h2>
              <p className="text-[14px] text-zinc-400 leading-[1.8] max-w-md">
                Most note apps are either too simple or too cluttered. KhalNote
                sits right in between — powerful enough for serious note-takers,
                clean enough to never feel overwhelming. Write, tag, remind, and
                find — that's it.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-3">
              {[
                [
                  "⚡",
                  "Fast by default",
                  "No loading screens, no bloat. Your notes are always ready.",
                ],
                [
                  "🔒",
                  "Private first",
                  "Your notes are yours. No ads, no selling your data.",
                ],
                [
                  "🎨",
                  "Actually beautiful",
                  "Dark mode, responsive, and designed with taste.",
                ],
              ].map(([emoji, title, desc]) => (
                <div
                  key={title as string}
                  className="flex gap-4 items-start p-4 rounded-xl bg-white/3 border border-white/5"
                >
                  <span className="text-xl mt-0.5">{emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white mb-0.5">
                      {title as string}
                    </p>
                    <p className="text-[12px] text-zinc-500">
                      {desc as string}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section
          id="cta"
          className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 scroll-mt-16"
        >
          <div className="relative rounded-2xl overflow-hidden border border-violet-500/20 bg-linear-to-br from-violet-900/25 via-[#0c0c10] to-fuchsia-900/15 p-10 sm:p-14 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-600/15 blur-[80px]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3 relative z-10">
              Start capturing ideas today.
            </h2>
            <p className="text-[14px] text-zinc-400 mb-8 relative z-10 max-w-md mx-auto leading-relaxed">
              Free to use. Takes 30 seconds to sign up. No credit card required.
            </p>

            <div className="flex flex-wrap gap-3 justify-center relative z-10">
              {session ? (
                <Link href="/main">
                  <Button className="bg-white text-[#0c0c10] hover:bg-zinc-100 h-11 px-8 rounded-xl text-sm font-bold cursor-pointer transition-all">
                    Open Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button className="bg-white text-[#0c0c10] hover:bg-zinc-100 h-11 px-8 rounded-xl text-sm font-bold cursor-pointer transition-all">
                      Create free account
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      className="h-11 px-8 rounded-xl text-sm border-white/10 bg-white/3 hover:bg-white/[0.07] text-zinc-300 hover:text-white transition-all cursor-pointer"
                    >
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer id="contact" className="border-t border-white/6 py-8 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded flex items-center justify-center bg-linear-to-br from-violet-500 to-fuchsia-600">
                <NotebookPen className="w-2.5 h-2.5 text-white" />
              </div>
              <span>KhalNote</span>
            </div>
            <p>© {new Date().getFullYear()} KhalNote. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <span className="text-zinc-400 font-medium text-[13px]">Contact: 09038244886</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
