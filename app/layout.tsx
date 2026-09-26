import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://note-pad-app-nu.vercel.app"),
  title: {
    default: "KhalNote — Your Personal Notepad",
    template: "%s | KhalNote",
  },
  description:
    "KhalNote is a private, fast, beautifully designed notepad. Capture thoughts, organize with tags, set reminders, and let AI surface what you've forgotten.",
  alternates: {
    canonical: "https://note-pad-app-nu.vercel.app",
  },
  keywords: ["notes", "notepad", "ai notes", "personal notes", "KhalNote"],
  authors: [{ name: "Khalid Olusesi" }],
  openGraph: {
    type: "website",
    siteName: "KhalNote",
    title: "KhalNote — Your Personal Notepad",
    description:
      "A private, fast notepad with AI-powered search, tags, reminders, and more.",
    images: [
      {
        url: "/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "KhalNote — Your Personal Notepad",
      },
    ],
  },
  icons: {
    icon: "/icon.svg?v=2",
    apple: "/icon.svg?v=2",
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
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
        <Toaster />

        <Analytics />
      </body>
    </html>
  );
}
