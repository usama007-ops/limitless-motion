'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext.jsx'

export default function AdminGuard({ children }) {
  const router = useRouter()
  const { isAdmin, isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.replace('/login?redirect=/admin')
    } else if (!isAdmin) {
      router.replace('/dashboard')
    }
  }, [loading, isAuthenticated, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <>{children}</>
}
