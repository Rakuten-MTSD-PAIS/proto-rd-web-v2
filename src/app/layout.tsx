import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Rakuten Drive",
  description: "Rakuten Drive – Cloud Storage",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <body className="h-full flex flex-col"><TooltipProvider>{children}</TooltipProvider></body>
    </html>
  );
}
