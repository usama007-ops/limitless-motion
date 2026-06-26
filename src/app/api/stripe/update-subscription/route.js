import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getAdminClient } from '@/lib/supabaseAdmin'

const TIER_PRICING = {
  basic: { monthly: 999, yearly: 99999 },
  premium: { monthly: 1999, yearly: 199999 },
  elite: { monthly: 4999, yearly: 499999 },
}

function getPrice(tier, billingCycle) {
  const tierLower = tier.toLowerCase()
  const cycleLower = billingCycle.toLowerCase()
  if (!TIER_PRICING[tierLower] || !TIER_PRICING[tierLower][cycleLower]) {
    throw new Error(`Invalid tier or billing cycle`)
  }
  return TIER_PRICING[tierLower][cycleLower]
}

function getBillingInterval(billingCycle) {
  return billingCycle.toLowerCase() === 'yearly' ? 'year' : 'month'
}

export async function POST(request) {
  try {
    const { subscriptionId, newTier, newBillingCycle, userId } = await request.json()

    if (!subscriptionId || !newTier || !newBillingCycle || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId, newTier, newBillingCycle, userId' },
        { status: 400 }
      )
    }

    const supabase = getAdminClient()
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: `User not found: ${userId}` }, { status: 404 })
    }

    if (profile.stripe_subscription_id !== subscriptionId) {
      return NextResponse.json(
        { error: 'Unauthorized: Subscription does not belong to this user' },
        { status: 403 }
      )
    }

    const newPrice = getPrice(newTier, newBillingCycle)
    const newInterval = getBillingInterval(newBillingCycle)

    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${newTier} Tier`,
              description: `${newTier} subscription - ${newBillingCycle}`,
            },
            unit_amount: newPrice,
            recurring: { interval: newInterval, interval_count: 1 },
          },
        },
      ],
      proration_behavior: 'create_prorations',
    })

    await supabase
      .from('profiles')
      .update({
        current_tier: newTier.toLowerCase(),
        billing_cycle: newBillingCycle.toLowerCase(),
      })
      .eq('id', userId)

    const nextBillingDate = new Date(updatedSubscription.current_period_end * 1000)
      .toISOString()
      .split('T')[0]

    return NextResponse.json({
      subscriptionId: updatedSubscription.id,
      status: updatedSubscription.status,
      tier: newTier,
      billingCycle: newBillingCycle,
      nextBillingDate,
    })
  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
