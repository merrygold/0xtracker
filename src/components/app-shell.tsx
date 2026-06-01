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
  Compass,
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
    <div className="flex h-screen bg-background grain-overlay">
      <aside
        className={cn(
          "flex flex-col border-r border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300 relative z-10",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-border/60 px-4 gap-3", collapsed && "justify-center px-2")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-heading text-lg shrink-0">
            0x
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading text-lg leading-tight tracking-tight">Tracker</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-none">Meridian</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}

          <Link
            href="/projects/new"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 border border-dashed border-border/80 hover:border-primary/40 hover:shadow-sm mt-4",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "New Project" : undefined}
          >
            <Plus className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>New Project</span>}
          </Link>
        </nav>

        <div className="border-t border-border/60">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center h-10 hover:bg-accent transition-colors text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <div className={cn("flex items-center justify-center p-3 border-t border-border/60", collapsed && "py-3")}>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}