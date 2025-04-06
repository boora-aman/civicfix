"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <MapPin className="h-6 w-6" />
        <span className="font-bold inline-block">CivicFix</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/issues"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/issues" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Issues
        </Link>
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/about" ? "text-foreground" : "text-foreground/60",
          )}
        >
          About
        </Link>
      </nav>
    </div>
  )
}

