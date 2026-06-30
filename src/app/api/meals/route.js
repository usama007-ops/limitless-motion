import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'

const ALLOWED_TABLES = ['meal_recipes', 'ethiopian_meals', 'high_protein_meals', 'fasting_breakfasts']

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get('table')

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    const admin = getAdminClient()
    let query = admin.from(table).select('*')

    const season = searchParams.get('season')
    if (season) query = query.eq('season', season)

    const category = searchParams.get('category')
    if (category) query = query.eq('category', category)

    const sortBy = searchParams.get('sortBy')
    if (sortBy) {
      const ascending = searchParams.get('ascending') === 'true'
      query = query.order(sortBy, { ascending })
    }

    const limit = searchParams.get('limit')
    if (limit) query = query.limit(parseInt(limit, 10))

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Meals API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
