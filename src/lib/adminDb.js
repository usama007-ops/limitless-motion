export async function adminCreate(table, data) {
  const res = await fetch('/api/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, data }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Create failed')
  }

  return res.json()
}

export async function adminDelete(table, id) {
  const res = await fetch('/api/create', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, id }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Delete failed')
  }

  return res.json()
}

export async function adminUpdate(table, id, data) {
  const res = await fetch('/api/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ table, id, data }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Update failed')
  }

  return res.json()
}
