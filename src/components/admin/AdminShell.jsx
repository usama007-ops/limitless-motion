'use client'

import React from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
