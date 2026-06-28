"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Lock,
  LogOut,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [autoSaveInterval, setAutoSaveInterval] = useState(1.5);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
    // Load saved preferences
    const saved = localStorage.getItem("notepadSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      setNotificationsEnabled(settings.notificationsEnabled ?? true);
      setEmailNotifications(settings.emailNotifications ?? false);
      setAutoSaveInterval(settings.autoSaveInterval ?? 1.5);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      notificationsEnabled,
      emailNotifications,
      autoSaveInterval,
    };
    localStorage.setItem("notepadSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.changePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true
      });

      if (!error) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePasswordDialog(false);
      } else {
        toast.error("Failed to change password. Check your current password.");
      }
    } catch (error) {
      toast.error("Error changing password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await authClient.deleteUser({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Account deleted successfully");
            router.push("/");
          },
        },
      });
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const handleExportNotes = () => {
    const notes = localStorage.getItem("exportedNotes");
    if (!notes) {
      toast.error("No notes to export");
      return;
    }

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(notes),
    );
    element.setAttribute(
      "download",
      `notes-export-${new Date().toISOString()}.json`,
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Notes exported successfully!");
  };

  const handleImportNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        localStorage.setItem("importedNotes", JSON.stringify(data));
        toast.success("Notes imported successfully!");
      } catch (error) {
        toast.error("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-purple-500/10 p-1.5 sm:p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500"
              >
                <circle cx="12" cy="12" r="1" />
                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m2.12-2.12l4.24-4.24" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold">Settings</h1>
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm">
            Manage your preferences and account
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="border border-border/50 bg-card/40 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          Appearance
        </h2>

        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Theme</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  theme === value
                    ? "border-purple-500 bg-purple-500/10 text-purple-500 shadow-sm"
                    : "border-border/60 hover:border-muted-foreground/30 hover:bg-muted/30"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="border border-border/50 bg-card/40 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          Account
        </h2>

        <div className="bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Email Address</span>
            <span className="text-sm font-medium break-all">
              {session?.user?.email || "Not set"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10 cursor-pointer"
          onClick={() => setShowChangePasswordDialog(true)}
        >
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
          Change Password
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/20 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 bg-red-500/5 shadow-sm">
        <h2 className="text-base sm:text-lg font-semibold text-red-500 flex items-center gap-2">
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          Danger Zone
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="w-full sm:flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs sm:text-sm h-9 sm:h-10 cursor-pointer"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Logout
          </Button>

          <Button
            variant="outline"
            className="w-full sm:flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs sm:text-sm h-9 sm:h-10 cursor-pointer"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Change Password Dialog */}
      <AlertDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your current password and choose a new one
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10"
              />
              <button
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to login again to
              access your notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your notes and data will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
