'use client'

import React, { useState, useEffect } from 'react'
import { Users, CreditCard, CalendarCheck, MessageSquare, Dumbbell, UtensilsCrossed } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import StatCard from '@/components/admin/StatCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Admin Dashboard - Limitless Motion'
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users?limit=5'),
      ])
      if (!statsRes.ok || !usersRes.ok) throw new Error('Failed to fetch data')
      const statsData = await statsRes.json()
      const usersData = await usersRes.json()
      setStats(statsData)
      setRecentUsers(usersData.users || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Dashboard" description="Welcome to the admin panel." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
              <div className="h-4 w-24 bg-muted rounded mb-3" />
              <div className="h-8 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Dashboard" description="Welcome to the admin panel." />
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">
          Failed to load stats: {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Overview of your Limitless Motion platform." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
        <StatCard title="Active Memberships" value={stats.activeMemberships} icon={CreditCard} />
        <StatCard title="Pending Bookings" value={stats.pendingBookings} icon={CalendarCheck} />
        <StatCard title="Community Posts" value={stats.totalPosts} icon={MessageSquare} />
        <StatCard title="Workout Programs" value={stats.totalWorkoutPrograms} icon={Dumbbell} />
        <StatCard title="Meal Recipes" value={stats.totalMealRecipes} icon={UtensilsCrossed} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Signups</h3>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
                    {(user.name || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name || 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {user.role === 'admin' ? (
                      <span className="text-accent font-medium">Admin</span>
                    ) : user.is_premium ? (
                      <span className="text-green-600 font-medium">{user.current_tier || 'Premium'}</span>
                    ) : (
                      'Free'
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Bookings</h3>
          <p className="text-sm text-muted-foreground">No recent bookings.</p>
        </div>
      </div>
    </div>
  )
}
