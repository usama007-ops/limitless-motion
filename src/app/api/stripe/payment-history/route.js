import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    let query = supabase
      .from('payment_history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      items: (data || []).map((item) => ({
        id: item.id,
        amount: item.amount,
        currency: item.currency || 'usd',
        status: item.status,
        date: item.created_at,
        receiptUrl: item.receipt_url,
        description: item.description,
        invoiceId: item.invoice_id,
      })),
      pagination: {
        page,
        perPage: limit,
        totalItems: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Payment history error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
