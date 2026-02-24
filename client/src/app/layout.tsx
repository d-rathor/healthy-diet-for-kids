import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import BottomNav from "@/components/layout/BottomNav";
import Providers from "@/components/Providers";
import TopHeader from "@/components/layout/TopHeader";

export const metadata: Metadata = {
  title: "Kids Protein PWA",
  description: "High-Protein Indian Recipe App for Moms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#eef3ea] flex justify-center`}
      >
        <Providers>
          <div className="w-full max-w-md min-h-screen bg-[#f4f9f0] shadow-xl relative overflow-hidden flex flex-col">
            <TopHeader />
            <main className="flex-1 overflow-y-auto pb-24 relative">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
