import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toaster } from '@/components/shared/Toaster'

export const metadata: Metadata = {
  title: "PO Dads | Hampshire's Dad & Toddler Community",
  description:
    "The community platform for dads with toddlers in the Waterlooville, Havant and Fareham area of Hampshire. Discover family-friendly places, meetups and dad chat.",
  keywords: ["dads", "toddlers", "Waterlooville", "Havant", "Fareham", "Hampshire", "family", "playground", "meetups"],
  openGraph: {
    title: "PO Dads | Hampshire's Dad & Toddler Community",
    description: "Your crew is out there, Dad. Discover family-friendly places, arrange meetups, and chat with other dads in Waterlooville, Havant and Fareham.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
        <Toaster />
      </body>
    </html>
  )
}
