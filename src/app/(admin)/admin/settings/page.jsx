'use client'

import React, { useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export default function AdminSettings() {
  useEffect(() => { document.title = 'Settings - Admin - Limitless Motion' }, [])

  return (
    <div>
      <AdminPageHeader title="Settings" description="Application settings." />
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm text-muted-foreground">Settings page coming soon. Configuration options will be added here.</p>
      </div>
    </div>
  )
}
