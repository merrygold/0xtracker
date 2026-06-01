"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/reference", label: "Reference Guide", icon: BookOpen },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          "flex flex-col border-r bg-card transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className={cn("flex h-14 items-center border-b px-4", collapsed && "justify-center")}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-primary text-xl">0x</span>
              <span>Tracker</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="font-bold text-lg text-primary">
              0x
            </Link>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}

          <Link
            href="/projects/new"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors mt-4 border border-dashed border-border",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "New Project" : undefined}
          >
            <Plus className="h-5 w-5 shrink-0" />
            {!collapsed && <span>New Project</span>}
          </Link>
        </nav>

<button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-10 items-center justify-center border-t hover:bg-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <div className={cn("flex items-center justify-center border-t p-2", collapsed && "py-2")}>
            <ThemeToggle />
          </div>
        </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}