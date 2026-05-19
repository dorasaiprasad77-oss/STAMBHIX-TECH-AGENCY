import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ThemeInitializer from "./components/ThemeInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MemoryChain — Your AI-Powered Personal Memory Assistant",
  description:
    "MemoryChain uses AI to capture, organize, and preserve your most important memories, thoughts, and experiences. Never forget what matters most.",
  keywords: ["memories", "AI", "memory assistant", "journal", "notes", "personal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeInitializer />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
