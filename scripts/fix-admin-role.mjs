import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const envVars = {}
envContent.split('\n').forEach((line) => {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim()
})

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function fixAdmin() {
  const email = 'admin@limitlessmotion.com'

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)

  if (error) { console.error('Query error:', error); return }

  if (!profiles || profiles.length === 0) {
    console.log('No profile found for', email)
    return
  }

  console.log('Found profiles:')
  profiles.forEach((p, i) => {
    console.log(`  [${i}] id=${p.id} role=${p.role} name=${p.name} email=${p.email}`)
  })

  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin', name: 'admin', is_premium: true, current_tier: 'elite' })
    .eq('email', email)
    .select()

  if (updateError) {
    console.error('Update error:', updateError)
    return
  }

  console.log('Updated profiles:')
  updated.forEach((p) => {
    console.log(`  id=${p.id} role=${p.role} name=${p.name}`)
  })
  console.log('\n✅ Done! Try logging in again.')
}

fixAdmin()
