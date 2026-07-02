import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const TIER_PRICING = {
  basic: { monthly: 999, yearly: 99999 },
  premium: { monthly: 1999, yearly: 199999 },
  elite: { monthly: 4999, yearly: 499999 },
}

export async function POST(request) {
  try {
    const { tier, billingCycle, successUrl, cancelUrl } = await request.json()

    if (!tier || !billingCycle || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, billingCycle, successUrl, cancelUrl' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { session: authSession } } = await supabase.auth.getSession()
    if (!authSession?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const tierLower = tier.toLowerCase()
    const cycleLower = billingCycle.toLowerCase()

    if (!TIER_PRICING[tierLower]) {
      return NextResponse.json({ error: `Invalid tier: ${tier}` }, { status: 400 })
    }

    if (!TIER_PRICING[tierLower][cycleLower]) {
      return NextResponse.json({ error: `Invalid billing cycle: ${billingCycle}` }, { status: 400 })
    }

    const price = TIER_PRICING[tierLower][cycleLower]
    const interval = cycleLower === 'yearly' ? 'year' : 'month'

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${tier} Subscription - ${billingCycle}` },
            unit_amount: price,
            recurring: { interval, interval_count: 1 },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: authSession.user.id,
      metadata: {
        user_id: authSession.user.id,
        tier: tierLower,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Create subscription checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
