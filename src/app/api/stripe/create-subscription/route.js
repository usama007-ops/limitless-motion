import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getAdminClient } from '@/lib/supabaseAdmin'

const TIER_PRICING = {
  basic: { monthly: 999, yearly: 99999 },
  premium: { monthly: 1999, yearly: 199999 },
  elite: { monthly: 4999, yearly: 499999 },
}

function getPrice(tier, billingCycle) {
  const tierLower = tier.toLowerCase()
  const cycleLower = billingCycle.toLowerCase()

  if (!TIER_PRICING[tierLower]) {
    throw new Error(`Invalid tier: ${tier}. Must be Basic, Premium, or Elite`)
  }

  if (!TIER_PRICING[tierLower][cycleLower]) {
    throw new Error(`Invalid billing cycle: ${billingCycle}. Must be monthly or yearly`)
  }

  return TIER_PRICING[tierLower][cycleLower]
}

function getBillingInterval(billingCycle) {
  return billingCycle.toLowerCase() === 'yearly' ? 'year' : 'month'
}

export async function POST(request) {
  try {
    const { tier, paymentMethodId, billingCycle, userId } = await request.json()

    if (!tier || !paymentMethodId || !billingCycle || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, paymentMethodId, billingCycle, userId' },
        { status: 400 }
      )
    }

    const price = getPrice(tier, billingCycle)
    const interval = getBillingInterval(billingCycle)

    const supabase = getAdminClient()
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: `User not found: ${userId}` }, { status: 404 })
    }

    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        metadata: { userId },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tier} Tier`,
              description: `${tier} subscription - ${billingCycle}`,
            },
            unit_amount: price,
            recurring: { interval, interval_count: 1 },
          },
        },
      ],
      payment_method: paymentMethodId,
      off_session: true,
      default_payment_method: paymentMethodId,
    })

    const today = new Date().toISOString().split('T')[0]

    await supabaseAdmin
      .from('profiles')
      .update({
        stripe_subscription_id: subscription.id,
        current_tier: tier.toLowerCase(),
        billing_cycle: billingCycle.toLowerCase(),
        is_premium: true,
        membership_start_date: today,
      })
      .eq('id', userId)

    const nextBillingDate = new Date(subscription.current_period_end * 1000)
      .toISOString()
      .split('T')[0]

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      nextBillingDate,
    })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
