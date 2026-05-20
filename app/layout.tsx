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
    "Stambhix Tech Agency — We build modern websites, apps, and digital experiences. Small team, big ambitions, quality results.",
  keywords: [
    "tech agency",
    "web development",
    "app development",
    "UI UX design",
    "SEO",
    "digital agency",
    "Stambhix",
    "website builder",
  ],
  openGraph: {
    title: "Stambhix Tech Agency — Building Digital Futures",
    description: "Stambhix is a technology agency specializing in web development, app development, and digital solutions.",
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
