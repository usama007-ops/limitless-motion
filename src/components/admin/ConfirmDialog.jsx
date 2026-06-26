'use client'

import React from 'react'
import { X } from 'lucide-react'

export default function ConfirmDialog({ open, onConfirm, onCancel, title, message, confirmLabel = 'Delete', loading = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-semibold text-foreground">{title || 'Confirm'}</h3>
        <p className="text-sm text-muted-foreground mt-2">{message || 'Are you sure?'}</p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/70 rounded-md transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
