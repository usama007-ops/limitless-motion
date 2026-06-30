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
      } else if (f.type === 'repeater') {
        payload[f.name] = Array.isArray(val) ? val : []
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
      const isObjOpts = typeof options[0] === 'object'
      return (
        <select
          id={field.name}
          value={val}
          onChange={(e) => handleChange(field.name, e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground disabled:opacity-50"
        >
          {field.placeholder && <option value="">{field.placeholder}</option>}
          {options.map((opt) => {
            const optVal = isObjOpts ? opt.value : opt
            const optLabel = isObjOpts ? opt.label : opt
            return <option key={optVal} value={optVal}>{optLabel}</option>
          })}
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

    if (field.type === 'repeater') {
      const items = Array.isArray(val) ? val : []
      const isSimple = field.itemType === 'simple'
      const subFields = field.fields || []
      const addItem = () => {
        if (isSimple) {
          handleChange(field.name, [...items, ''])
        } else {
          const newItem = {}
          subFields.forEach(f => { newItem[f.name] = '' })
          handleChange(field.name, [...items, newItem])
        }
      }
      const removeItem = (idx) => {
        handleChange(field.name, items.filter((_, i) => i !== idx))
      }
      const updateItem = (idx, subName, subValue) => {
        if (isSimple) {
          const updated = items.map((item, i) => i === idx ? subValue : item)
          handleChange(field.name, updated)
        } else {
          const updated = items.map((item, i) => i === idx ? { ...item, [subName]: subValue } : item)
          handleChange(field.name, updated)
        }
      }
      return (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4 space-y-3 bg-muted/20 relative">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute top-2 right-2 text-xs text-destructive hover:text-destructive/80 font-bold"
              >
                ×
              </button>
              {isSimple ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={item || ''}
                    onChange={(e) => updateItem(idx, null, e.target.value)}
                    className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {subFields.map((sf) => (
                    <div key={sf.name} className={sf.type === 'textarea' ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">{sf.label}</label>
                      {sf.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={item[sf.name] || ''}
                          onChange={(e) => updateItem(idx, sf.name, e.target.value)}
                          className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                      ) : (
                        <input
                          type={sf.type === 'number' ? 'number' : 'text'}
                          value={item[sf.name] || ''}
                          onChange={(e) => updateItem(idx, sf.name, e.target.value)}
                          className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/30"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
          >
            + Add {field.itemLabel || 'Item'}
          </button>
        </div>
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
