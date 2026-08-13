"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/webpage/Navbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/software" || pathname?.startsWith("/software/");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div>
          {!hideNavbar && <Navbar />}
          {children}

          <div className="border-t border-emerald-100 py-3 text-center text-xs text-slate-500">
            © 2026 Sakin Pharmacy. All Rights Reserved. | Developed by{" "}
            <Link href="https://www.linkedin.com/in/samsad-sakin-24a86a3a3/" target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-700">
              Md.Samsad Sakin
            </Link>
          </div>

        </div>
      </body>
    </html>
  );
}