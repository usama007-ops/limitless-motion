'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Dumbbell, Video, Trophy, Heart,
  UtensilsCrossed,
  Globe, Beef, Sunrise,
  Film, Mic, Quote,
  MessageSquare, Star,
  Shirt, Tag,
  CalendarCheck, CreditCard, Receipt, Settings,
  LogOut, ChevronDown, ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { cn } from '@/lib/utils'

const sections = [
  {
    label: null,
    items: [
      { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Workouts',
    items: [
      { label: 'Programs', path: '/admin/workout-programs', icon: Dumbbell },

      { label: 'Videos', path: '/admin/workout-videos', icon: Video },
      { label: 'Challenges', path: '/admin/challenges', icon: Trophy },
      { label: 'Recovery', path: '/admin/recovery', icon: Heart },
    ],
  },
  {
    label: 'Nutrition',
    items: [
      { label: 'All Meals', path: '/admin/meals', icon: UtensilsCrossed },
      { label: 'Standard', path: '/admin/meal-recipes', icon: UtensilsCrossed },
      { label: 'Ethiopian', path: '/admin/ethiopian-meals', icon: Globe },
      { label: 'High Protein', path: '/admin/high-protein-meals', icon: Dumbbell },
      { label: 'Fasting Breakfast', path: '/admin/fasting-breakfasts', icon: Sunrise },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Interviews', path: '/admin/videos', icon: Film },
      { label: 'Podcasts', path: '/admin/podcasts', icon: Mic },
      { label: 'Affirmations', path: '/admin/affirmations', icon: Quote },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Posts', path: '/admin/community-posts', icon: MessageSquare },
      { label: 'Success Stories', path: '/admin/success-stories', icon: Star },
    ],
  },
  {
    label: 'Shop',
    items: [
      { label: 'Attire', path: '/admin/attire', icon: Shirt },
      { label: 'Products', path: '/admin/apparel-products', icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
      { label: 'Memberships', path: '/admin/memberships', icon: CreditCard },
      { label: 'Payments', path: '/admin/payment-history', icon: Receipt },
      { label: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, logout } = useAuth()
  const [openSection, setOpenSection] = useState('Workouts')

  const isActive = (path) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  function toggleSection(label) {
    setOpenSection(prev => prev === label ? null : label)
  }

  function isSectionActive(items) {
    return items.some(item => isActive(item.path))
  }

  return (
    <aside className="w-[260px] min-h-screen flex flex-col bg-card border-r border-border shrink-0">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
            LM
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight text-foreground">Limitless</p>
            <p className="font-semibold text-sm leading-tight text-accent">Motion</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sections.map((section, i) => (
          <div key={i}>
            {section.label ? (
              <>
                <button
                  onClick={() => toggleSection(section.label)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] rounded-md transition-colors',
                    openSection === section.label
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span>{section.label}</span>
                  {openSection === section.label ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>
                {openSection === section.label && (
                  <div className="ml-1 space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.path)
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                            active
                              ? 'bg-accent/10 text-accent border-l-[3px] border-accent'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-[3px] border-transparent'
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-accent/10 text-accent border-l-[3px] border-accent'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-[3px] border-transparent'
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
            {i < sections.length - 1 && section.items.length > 0 && (
              <div className="my-2 mx-3 border-t border-border" />
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-semibold text-foreground">
            {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{profile?.name || 'Admin'}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
