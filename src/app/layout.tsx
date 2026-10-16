import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "八十億分之一 · 80億人修仙",
  description:
    "當世八十億人都踏入修途。你是其中一個。靈根、壽元與名額會把你放到某一層。",
};

export const viewport: Viewport = {
  themeColor: "#efe4d0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant" className="h-full antialiased">
      <body className="min-h-full">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
