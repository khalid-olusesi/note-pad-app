"use client";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/ui/toggle";
import { ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Plus,
  Notebook,
  Star,
  Tag,
  Trash2,
  HelpCircle,
  CircleCheck,
  ArrowLeft,
  Menu,
  X,
  NotebookPen,
  Sparkles,
  LogOut,
  ChevronDown,
  ArrowLeftRight,
  Settings,
} from "lucide-react";
import AppLogo from "@/components/ui/web/AppLogo";
import { SearchInput } from "@/components/ui/search-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const tagsConfig = [
  { name: "Work", color: "bg-purple-500" },
  { name: "Personal", color: "bg-blue-500" },
  { name: "Ideas", color: "bg-green-500" },
  { name: "Study", color: "bg-yellow-500" },
  { name: "Others", color: "bg-orange-500" },
];

interface SidebarContentProps {
  isCollapsed?: boolean;
  isNewNotesPage: boolean;
  router: ReturnType<typeof useRouter>;
  pathname: string;
  setIsMobileMenuOpen: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  tagsConfig: typeof tagsConfig;
  getTagCount: (tagName: string) => number;
}

const SidebarContent = ({
  isCollapsed = false,
  isNewNotesPage,
  router,
  pathname,
  setIsMobileMenuOpen,
  session,
  tagsConfig,
  getTagCount,
}: SidebarContentProps) => {
  return (
    <>
    <div
      className={`mb-6 px-2 md:flex hidden items-center ${isCollapsed ? "justify-center" : "justify-start"}`}
    >
      {!isCollapsed && <AppLogo />}
      {isCollapsed && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-linear-to-br from-purple-500 to-fuchsia-600 shadow-lg shadow-purple-500/20">
          <NotebookPen className="w-4 h-4 text-white" />
        </div>
      )}
    </div>

    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 text-sm">
        {isNewNotesPage && (
          <div className={`mb-4 ${isCollapsed ? "flex justify-center" : ""}`}>
            <Button
              onClick={() => {
                router.push("/main/newNotes");
                setIsMobileMenuOpen(false);
              }}
              className={
                isCollapsed
                  ? "w-10 h-10 p-0 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer flex items-center justify-center mx-auto"
                  : "w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 justify-start px-3 py-2 h-auto cursor-pointer"
              }
              title="New Note"
            >
              <Plus className="w-4 h-4" />
              {!isCollapsed && <span>New Note</span>}
            </Button>
          </div>
        )}

        <Link
          href="/main"
          onClick={() => setIsMobileMenuOpen(false)}
          title="All Notes"
          className={`flex items-center transition-colors ${isCollapsed ? "justify-center w-10 h-10 mx-auto rounded-lg" : "gap-3 rounded-lg px-3 py-2"} ${
            pathname === "/main"
              ? "bg-purple-500/15 text-purple-400 font-medium"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <Notebook className="w-4 h-4" />
          {!isCollapsed && <span>All Notes</span>}
        </Link>

        <Link
          href="/main/favorite"
          onClick={() => setIsMobileMenuOpen(false)}
          title="Favorites"
          className={`flex items-center transition-colors cursor-pointer ${isCollapsed ? "justify-center w-10 h-10 mx-auto rounded-lg" : "gap-3 rounded-lg px-3 py-2"} ${
            pathname.startsWith("/main/favorite")
              ? "bg-yellow-500/15 text-yellow-500 font-medium"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <Star className="w-4 h-4" />
          {!isCollapsed && <span>Favorites</span>}
        </Link>

        <Link
          href="/main/tags"
          onClick={() => setIsMobileMenuOpen(false)}
          title="Tags"
          className={`flex items-center transition-colors cursor-pointer ${isCollapsed ? "justify-center w-10 h-10 mx-auto rounded-lg" : "gap-3 rounded-lg px-3 py-2"} ${
            pathname.startsWith("/main/tags")
              ? "bg-purple-500/15 text-purple-400 font-medium"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <Tag className="w-4 h-4" />
          {!isCollapsed && <span>Tags</span>}
        </Link>

        <Link
          href="/main/trash"
          onClick={() => setIsMobileMenuOpen(false)}
          title="Trash"
          className={`flex items-center transition-colors cursor-pointer ${isCollapsed ? "justify-center w-10 h-10 mx-auto rounded-lg" : "gap-3 rounded-lg px-3 py-2"} ${
            pathname === "/main/trash"
              ? "bg-red-500/15 text-red-400 font-medium"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {!isCollapsed && <span>Trash</span>}
        </Link>

        <div className="my-2 border-t border-border/30" />

        <Link
          href="/main/ai-chat"
          onClick={() => setIsMobileMenuOpen(false)}
          title="AI Chat"
          className={`flex items-center transition-colors cursor-pointer ${isCollapsed ? "justify-center w-10 h-10 mx-auto rounded-lg" : "gap-3 rounded-lg px-3 py-2"} ${
            pathname === "/main/ai-chat"
              ? "bg-fuchsia-500/15 text-fuchsia-400 font-medium"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {!isCollapsed && <span>AI Chat</span>}
        </Link>
      </nav>

      {!isCollapsed && <div className="my-6 border-t border-border/50"></div>}

      {/* Tags Section */}
      {!isCollapsed && (
        <div className="flex-1">
          <div className="flex items-center justify-between px-3 mb-2 text-sm font-semibold text-muted-foreground">
            <span>Tags</span>
            <button className="hover:bg-muted/80 p-1 rounded-md transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-0.5">
            {tagsConfig.map((tag) => (
              <div
                key={tag.name}
                title={tag.name}
                onClick={() => {
                  router.push(`/main/tags`);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground justify-between px-3 py-1.5 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full w-2.5 h-2.5 ${tag.color}`}
                  ></div>
                  <span>{tag.name}</span>
                </div>
                <span className="text-xs font-medium opacity-50">
                  {getTagCount(tag.name)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="mt-auto flex flex-col gap-1 pt-6">

        <Link
          href="/main/settings"
          onClick={() => setIsMobileMenuOpen(false)}
          title="Settings"
          className={`flex items-center text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-lg transition-colors cursor-pointer text-left ${isCollapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2"}`}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        {/* User Profile Section */}
        {!isCollapsed && session && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer mt-2 text-left">
                <div className="w-7 h-7 rounded-md bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                  {session.user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">
                    {session.user?.name ||
                      session.user?.email?.split("@")[0] ||
                      "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {session.user?.email || "No email"}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 mb-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Account</p>
              </div>
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/auth/login");
                      },
                    },
                  });
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Switch Account</span>
              </DropdownMenuItem>
              <div className="h-px bg-border my-1" />
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/");
                      },
                    },
                  });
                }}
                className="flex items-center gap-2 text-red-400 hover:!bg-red-500/10 hover:!text-red-500 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Collapsed Profile Avatar */}
        {isCollapsed && session && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                title={session.user?.email || "User"}
                className="w-8 h-8 rounded-md bg-linear-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-semibold text-xs hover:shadow-lg hover:shadow-purple-500/30 transition-all cursor-pointer mx-auto"
              >
                {session.user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-2 mb-1 border-b border-border/50">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.user?.name ||
                    session.user?.email?.split("@")[0] ||
                    "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user?.email || "No email"}
                </p>
              </div>
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/auth/login");
                      },
                    },
                  });
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Switch Account</span>
              </DropdownMenuItem>
              <div className="h-px bg-border my-1" />
              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.push("/");
                      },
                    },
                  });
                }}
                className="flex items-center gap-2 text-red-400 hover:!bg-red-500/10 hover:!text-red-500 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
    </>
  );
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isNewNotesPage = pathname === "/main/newNotes";
  const isUtilityPage =
    pathname === "/main/ai-chat" || pathname === "/main/settings";
  const { data: session, isPending } = authClient.useSession();
  const [showSaved, setShowSaved] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleNoteSaved = () => {
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    };
    window.addEventListener("note-saved", handleNoteSaved);
    return () => window.removeEventListener("note-saved", handleNoteSaved);
  }, []);

  const notes = useQuery(api.notes.getNotesList);
  const unreadNotificationsCount =
    useQuery(api.notifications.getUnreadNotificationsCount) || 0;
  const createNotification = useMutation(api.notifications.createNotification);

  const notifiedReminders = useRef(new Set<string>());

  useEffect(() => {
    if (!notes) return;

    const checkReminders = () => {
      const now = Date.now();

      notes.forEach((note) => {
        if (
          note.reminderEnabled &&
          note.reminderTime &&
          note.reminderTime <= now
        ) {
          if (!notifiedReminders.current.has(note._id)) {
            toast.info(`Reminder: ${note.title}`, {
              description: "You have a reminder for this note.",
              action: {
                label: "View",
                onClick: () => router.push(`/main/newNotes?noteId=${note._id}`),
              },
            });

            // Push notification to DB
            createNotification({
              title: "Reminder Due",
              message: `You have a reminder for the note: "${note.title}"`,
              type: "reminder",
              relatedNoteId: note._id,
            });

            notifiedReminders.current.add(note._id);
          }
        }
      });
    };

    checkReminders(); // Run immediately on mount or when notes change
    const interval = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notes, router, createNotification]);

  const getTagCount = (tagName: string) => {
    if (!notes) return 0;
    return notes.filter((n) => n.tag === tagName).length;
  };

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
    }
  }, [isPending, session, router]);

  if (!isPending && !session) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar Area */}
      <div
        className={`${isSidebarCollapsed ? "w-20" : "w-56"} transition-all duration-300 border-r hidden md:flex flex-col p-3 bg-background`}
      >
        <SidebarContent
          isCollapsed={isSidebarCollapsed}
          isNewNotesPage={isNewNotesPage}
          router={router}
          pathname={pathname}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          session={session}
          tagsConfig={tagsConfig}
          getTagCount={getTagCount}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] bg-background border-r h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-left-4 duration-200">
            <div className="flex items-center justify-between mb-6 px-1">
              <AppLogo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent
              isCollapsed={false}
              isNewNotesPage={isNewNotesPage}
              router={router}
              pathname={pathname}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              session={session}
              tagsConfig={tagsConfig}
              getTagCount={getTagCount}
            />
          </div>
        </div>
      )}


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-3 px-4 border-b gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1 rounded-md text-muted-foreground hover:bg-muted/50 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1 rounded-md text-muted-foreground hover:bg-muted/50 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="md:hidden">
              <AppLogo />
            </div>
          </div>

          {isNewNotesPage || isUtilityPage ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/main")}
              className="cursor-pointer border-0 flex items-center"
            >
              <ArrowLeft />
              Back to Notes
            </Button>
          ) : (
            <div className="hidden sm:block w-full max-w-md">
              <SearchInput />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 sm:gap-4 ml-auto">
            {showSaved && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CircleCheck className="w-4 h-4 text-green-500" />
                <span>Saved just now</span>
              </div>
            )}
            <ModeToggle />

            {isNewNotesPage ? null : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground relative cursor-pointer"
                  onClick={() => router.push("/main/notifications")}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Button>
                <Button
                  onClick={() => router.push("/main/newNotes")}
                  className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer px-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Note</span>
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
