'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3,
  Sparkles,
  FileText,
  Edit3,
  Video,
  TrendingUp,
  Shield,
  Users,
  BookOpen,
  Lightbulb,
  Settings,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Content Generator', href: '/dashboard/content-generator', icon: Sparkles },
  { name: 'Canvas Editor', href: '/dashboard/canvas-editor', icon: Edit3 },
  { name: 'Video Intelligence', href: '/dashboard/video-intelligence', icon: Video },
  { name: 'Story Gap Filler', href: '/dashboard/story-gap-filler', icon: FileText },
  { name: 'Trend Insights', href: '/dashboard/trend-insights', icon: TrendingUp },
  { name: 'Safety & Integrity', href: '/dashboard/safety-integrity', icon: Shield },
  { name: 'Audience Simulator', href: '/dashboard/audience-simulator', icon: Users },
  { name: 'Summarization', href: '/dashboard/summarization', icon: BookOpen },
  { name: 'Creative Assistant', href: '/dashboard/creative-assistant', icon: Lightbulb },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md bg-primary text-primary-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
          open ? 'w-64' : 'w-20',
          mobileOpen ? 'translate-x-0 w-64 z-40' : '-translate-x-full lg:translate-x-0',
          'lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Sparkles size={24} className="text-sidebar-primary-foreground" />
              </div>
              {open && (
                <div>
                  <h1 className="font-bold text-lg">ContentIQ</h1>
                  <p className="text-xs text-sidebar-foreground/60">AI Platform</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md transition-colors whitespace-nowrap',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {open && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Collapse Button */}
          <div className="p-3 border-t border-sidebar-border">
            <button
              onClick={() => setOpen(!open)}
              className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors"
            >
              <ChevronDown size={20} className={cn('transition-transform', !open && 'rotate-90')} />
              {open && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
