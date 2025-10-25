import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Notion Colorful",
  description: "A colorful Notion-like editor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gradient-to-br from-brand-50 via-cyan-50 to-rose-50 text-slate-800 antialiased">
        {children}
      </body>
    </html>
  );
}
