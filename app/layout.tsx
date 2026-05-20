import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stambhix Tech Agency — Digital & Home Service Marketplace",
  description:
    "Stambhix is a premium technology and services agency offering web development, app development, UI/UX design, SEO, and home services. Trusted professionals, one platform.",
  keywords: [
    "tech agency",
    "web development",
    "app development",
    "UI UX design",
    "SEO",
    "home services",
    "digital agency",
    "Stambhix",
  ],
  openGraph: {
    title: "Stambhix Tech Agency — Building Digital Futures",
    description: "From cutting-edge digital solutions to trusted home services — Stambhix connects you with verified professionals.",
    type: "website",
    locale: "en_IN",
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-primary text-primary">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
