'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'role', label: 'Role', type: 'select', options: ['user', 'admin'], required: true },
  { name: 'is_premium', label: 'Premium Member', type: 'select', options: ['true', 'false'], required: true },
  { name: 'current_tier', label: 'Membership Tier', type: 'select', options: ['', 'basic', 'premium', 'elite'] },
  { name: 'billing_cycle', label: 'Billing Cycle', type: 'select', options: ['', 'monthly', 'yearly'] },
]

export default function EditUser() {
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users?limit=200')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      const found = (data.users || []).find((u) => u.id === params.id)
      if (!found) throw new Error('User not found')
      setUser(found)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    document.title = 'Edit User - Admin - Limitless Motion'
    fetchUser()
  }, [fetchUser])

  async function handleSubmit(data) {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await adminUpdate('profiles', params.id, {
        name: data.name,
        role: data.role,
        is_premium: data.is_premium === 'true',
        current_tier: data.current_tier || null,
        billing_cycle: data.billing_cycle || null,
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminPageHeader title="Edit User" />
        <div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" />
      </div>
    )
  }

  if (error && !user) {
    return (
      <div>
        <AdminPageHeader title="Edit User" />
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title={`Edit User: ${user?.name || user?.email || params.id}`}
        description="Update user profile, role, and membership details."
      />

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
          User updated successfully.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm
          fields={fields}
          initialValues={user}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={saving}
        />
      </div>
    </div>
  )
}
