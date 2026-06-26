import { createClient } from '@supabase/supabase-js'

let _admin = null

export function getAdminClient() {
  if (_admin) return _admin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase admin credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  }

  _admin = createClient(url, key)
  return _admin
}
