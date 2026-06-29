import { createClient } from '@supabase/supabase-js'

process.loadEnvFile('.env.local')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function run() {
  // Try using the pg_dump or raw SQL endpoint
  const { error } = await supabase.rpc('exec_sql', { sql: 'alter table public.exercises add column if not exists program_id uuid references public.workout_programs(id) on delete cascade' })
  if (error) {
    console.log('RPC failed, trying direct SQL...')
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ sql: 'alter table public.exercises add column if not exists program_id uuid references public.workout_programs(id) on delete cascade' }),
    })
    console.log('Status:', res.status, await res.text())
  } else {
    console.log('Migration OK')
  }
}

run().catch(console.error)
