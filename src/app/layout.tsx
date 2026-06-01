import type { Metadata } from "next"
import { DM_Serif_Display, DM_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppShell } from "@/components/app-shell"

const dmSerif = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
})

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "0xTracker — MicroTool Builder Tracker",
  description:
    "Track every stage of building microtool websites — from idea to monetization. Manage projects, track finances, and follow the complete checklist.",
  manifest: "/manifest.json",
}

export const viewport = {
  themeColor: "#2A2826",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}