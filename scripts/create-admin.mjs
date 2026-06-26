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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const email = 'admin@limitlessmotion.com'
const password = 'admin123'
const name = 'admin'

async function createAdmin() {
  const { data: existingUsers, error: listError } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', email)

  if (existingUsers?.length > 0) {
    console.log(`Admin user already exists: ${email}`)
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin', name })
      .eq('email', email)
      .select()
    if (error) throw error
    console.log(`Updated existing user to admin role.`)
    console.log(`Login: ${email} / ${password}`)
    return
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (authError) throw authError

  const userId = authData.user.id

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email,
      name,
      role: 'admin',
      is_premium: true,
      current_tier: 'elite',
    })

  if (profileError) throw profileError

  console.log('✅ Admin user created successfully!')
  console.log(`   Email:    ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   Name:     ${name}`)
  console.log(`   Role:     admin`)
}

createAdmin().catch((err) => {
  console.error('Failed:', err.message)
  process.exit(1)
})
