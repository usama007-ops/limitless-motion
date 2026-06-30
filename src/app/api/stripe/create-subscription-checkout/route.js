import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

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
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Create subscription checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
