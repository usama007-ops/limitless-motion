'use client'

import React, { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'

const columns = [
  { key: 'user_id', label: 'User ID', render: (val) => val ? val.slice(0, 8) + '...' : '-' },
  { key: 'tier', label: 'Tier', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => {
    const colors = { active: 'bg-green-100 text-green-700', paused: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-700' }
    return <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors[val] || 'bg-muted text-muted-foreground'}`}>{val}</span>
  }},
  { key: 'start_date', label: 'Start', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
  { key: 'renewal_date', label: 'Renewal', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
  { key: 'auto_renew', label: 'Auto Renew', render: (val) => val ? 'Yes' : 'No' },
]

export default function AdminMemberships() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'Memberships - Admin - Limitless Motion'; fetchData() }, [])
  async function fetchData() {
    try {
      const supabase = (await import('@/lib/supabaseClient')).createClient()
      const { data } = await supabase.from('memberships').select('*').order('created_at', { ascending: false })
      setItems(data || [])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }
  if (loading) return <div><AdminPageHeader title="Memberships" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Memberships" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>
  return (<div><AdminPageHeader title="Memberships" description="View all memberships. (Read-only — manage via Stripe.)" /><DataTable columns={columns} data={items} searchable searchPlaceholder="Search by user ID..." /></div>)
}
