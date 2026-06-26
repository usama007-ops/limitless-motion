import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request, { params }) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId parameter is required' }, { status: 400 })
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: `Checkout session not found: ${sessionId}` }, { status: 404 })
    }

    return NextResponse.json({
      id: session.id,
      status: session.payment_status,
      amountTotal: session.amount_total,
      customerEmail: session.customer_details?.email,
    })
  } catch (error) {
    console.error('Retrieve session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
