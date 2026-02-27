'use client'

import { Bell, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="fixed top-0 right-0 left-64 lg:left-64 h-16 border-b border-border bg-background/95 backdrop-blur z-40 transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar - Placeholder */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search content..."
            className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors group">
            <Bell size={20} className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            <div className="absolute top-12 right-0 hidden group-hover:block bg-card text-card-foreground rounded-lg shadow-lg p-2 w-48 text-xs">
              <p className="font-semibold mb-2">Notifications</p>
              <p className="text-muted-foreground">New insights available for your recent analysis</p>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-foreground" />
            ) : (
              <Moon size={20} className="text-foreground" />
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Alex Chen</p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
              AC
            </div>
          </div>

          {/* Logout */}
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
