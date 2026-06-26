'use client'

import React from 'react'

export default function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && (
        <div className="shrink-0 ml-4">{action}</div>
      )}
    </div>
  )
}
