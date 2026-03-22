import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "CipherMind - AI Coding Mentor",
  description: "CipherMind remembers your mistakes. Learns your patterns. Makes you better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased min-h-screen bg-[#0a0a0f] text-white selection:bg-[#7c3aed] selection:text-white`}>
        <Providers>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
