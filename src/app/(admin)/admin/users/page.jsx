'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true, render: (val) => (
    <span className={val === 'admin' ? 'text-accent font-medium' : ''}>{val || 'user'}</span>
  )},
  { key: 'is_premium', label: 'Premium', render: (val) => val ? 'Yes' : 'No' },
  { key: 'current_tier', label: 'Tier', sortable: true },
  { key: 'created_at', label: 'Joined', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Users - Admin - Limitless Motion'
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users?limit=200')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.users)
      setTotal(data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(userId) {
    if (!confirm('Delete this user? This action cannot be undone.')) return
    try {
      const res = await fetch('/api/create', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'profiles', id: userId }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Users" description="Manage all registered users." />
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">
          Loading users...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <AdminPageHeader title="Users" description="Manage all registered users." />
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description={`${total} total user(s).`}
      />
      <DataTable
        columns={columns}
        data={users}
        searchable
        searchPlaceholder="Search by name or email..."
        onEdit={(id) => router.push(`/admin/users/${id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  )
}
