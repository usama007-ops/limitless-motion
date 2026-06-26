export async function uploadFile(file, table, extraFields = {}) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('table', table)

  for (const [key, value] of Object.entries(extraFields)) {
    formData.append(key, value)
  }

  const res = await fetch('/api/upload', { method: 'POST', body: formData })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Upload failed')
  }

  return res.json()
}
