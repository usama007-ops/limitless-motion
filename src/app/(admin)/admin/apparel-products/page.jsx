'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getApparelProducts } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'price', label: 'Price', sortable: true, render: (val) => val ? `$${val}` : '-' },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'in_stock', label: 'In Stock', render: (val) => val ? <span className="text-green-600 font-medium">Yes</span> : <span className="text-destructive">No</span> },
]

export default function AdminApparelProducts() {
  const router = useRouter()
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null); const [deleting, setDeleting] = useState(false)
  useEffect(() => { document.title = 'Products - Admin - Limitless Motion'; fetchData() }, [])
  async function fetchData() { try { const d = await getApparelProducts(); setItems(d || []) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  async function handleDelete(id) { setDeleting(true); try { await adminDelete('apparel_products', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) } catch (err) { alert(err.message) } finally { setDeleting(false) } }
  if (loading) return <div><AdminPageHeader title="Products" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Products" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>
  return (<div><AdminPageHeader title="Apparel Products" description="Manage shop products." action={<button onClick={() => router.push('/admin/apparel-products/new')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"><Plus className="w-4 h-4" /> New Product</button>} /><DataTable columns={columns} data={items} searchable onEdit={(id) => router.push(`/admin/apparel-products/${id}/edit`)} onDelete={(id) => setDeleteTarget(id)} /><ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Product" message="Are you sure?" /></div>)
}
