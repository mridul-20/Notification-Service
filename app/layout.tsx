import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { SocketProvider } from "@/components/socket-provider"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Notification Service",
  description: "A real-time notification service built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SocketProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto py-6 px-4">{children}</main>
              <Toaster />
            </div>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
