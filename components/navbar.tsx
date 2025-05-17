"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">Notification Service</h1>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/"
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Link>
            <Link
              href="/notifications"
              className={cn(
                "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === "/notifications"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <Bell className="mr-2 h-4 w-4" />
              View Notifications
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
