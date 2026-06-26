'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex items-start gap-4">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground mt-0.5">{value}</p>
        {trend !== undefined && (
          <p className={cn(
            'text-xs mt-1',
            trend >= 0 ? 'text-green-600' : 'text-destructive'
          )}>
            {trend >= 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </div>
    </div>
  )
}
