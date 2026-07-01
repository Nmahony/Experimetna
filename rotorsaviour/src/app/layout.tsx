import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "RotorSAVIOUR",
  description: "Monthly rota generation and management",
};

const NAV = [
  { href: "/rota", label: "Rota" },
  { href: "/staff", label: "Staff" },
  { href: "/leave", label: "Leave" },
  { href: "/template", label: "Template" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-screen-2xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight">
              Rotor<span className="text-blue-600">SAVIOUR</span>
            </Link>
            <nav className="flex gap-4 text-sm text-slate-600">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-slate-900">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
