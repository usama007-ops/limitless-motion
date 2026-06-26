'use client'

import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminForm({ fields, initialValues, onSubmit, submitLabel = 'Save', loading = false }) {
  const [values, setValues] = useState({})

  useEffect(() => {
    if (initialValues) {
      const init = {}
      fields.forEach((f) => {
        init[f.name] = initialValues[f.name] ?? ''
      })
      setValues(init)
    } else {
      const init = {}
      fields.forEach((f) => {
        init[f.name] = f.type === 'number' ? '' : ''
      })
      setValues(init)
    }
  }, [initialValues, fields])

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {}
    fields.forEach((f) => {
      const val = values[f.name]
      if (f.type === 'number') {
        payload[f.name] = val === '' ? null : Number(val)
      } else if (f.type === 'json') {
        try {
          payload[f.name] = val ? JSON.parse(val) : null
        } catch {
          payload[f.name] = val
        }
      } else {
        payload[f.name] = val
      }
    })
    onSubmit(payload)
  }

  const renderField = (field) => {
    const val = values[field.name] ?? ''

    if (field.type === 'textarea') {
      return (
        <textarea
          id={field.name}
          rows={field.rows || 3}
          value={val}
          onChange={(e) => handleChange(field.name, e.target.value)}
          disabled={loading}
          placeholder={field.placeholder || ''}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        />
      )
    }

    if (field.type === 'select') {
      const options = field.options || []
      return (
        <select
          id={field.name}
          value={val}
          onChange={(e) => handleChange(field.name, e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground disabled:opacity-50"
        >
          {field.placeholder && <option value="">{field.placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    }

    if (field.type === 'json') {
      return (
        <textarea
          id={field.name}
          rows={field.rows || 4}
          value={typeof val === 'object' ? JSON.stringify(val, null, 2) : val}
          onChange={(e) => handleChange(field.name, e.target.value)}
          disabled={loading}
          placeholder={field.placeholder || 'JSON value'}
          className="w-full px-3 py-2 text-sm font-mono bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        />
      )
    }

    if (field.type === 'number') {
      return (
        <input
          id={field.name}
          type="number"
          step={field.step || 'any'}
          value={val}
          onChange={(e) => handleChange(field.name, e.target.value)}
          disabled={loading}
          placeholder={field.placeholder || ''}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
        />
      )
    }

    return (
      <input
        id={field.name}
        type={field.type || 'text'}
        value={val}
        onChange={(e) => {
          if (field.type === 'file') return
          handleChange(field.name, e.target.value)
        }}
        disabled={loading}
        placeholder={field.placeholder || ''}
        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground disabled:opacity-50"
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          {field.helpText && (
            <p className="text-xs text-muted-foreground mb-1.5">{field.helpText}</p>
          )}
          {renderField(field)}
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
