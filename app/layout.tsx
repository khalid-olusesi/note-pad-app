import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KhalNote — Your Personal Notepad",
    template: "%s | KhalNote",
  },
  description:
    "KhalNote is a private, fast, beautifully designed notepad. Capture thoughts, organize with tags, set reminders, and let AI surface what you've forgotten.",
  keywords: ["notes", "notepad", "ai notes", "personal notes", "KhalNote"],
  authors: [{ name: "Khalid Olusesi" }],
  openGraph: {
    type: "website",
    siteName: "KhalNote",
    title: "KhalNote — Your Personal Notepad",
    description:
      "A private, fast notepad with AI-powered search, tags, reminders, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
