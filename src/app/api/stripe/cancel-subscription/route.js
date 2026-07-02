import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getAdminClient } from '@/lib/supabaseAdmin'

export async function POST(request) {
  try {
    const { subscriptionId, action, userId } = await request.json()

    if (!subscriptionId || !action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId, action, userId' },
        { status: 400 }
      )
    }

    if (!['cancel', 'pause'].includes(action.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "cancel" or "pause"' },
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!profile.stripe_subscription_id) {
      return NextResponse.json({ error: 'No subscription found for this account' }, { status: 400 })
    }

    if (profile.stripe_subscription_id !== subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription does not belong to this user' },
        { status: 403 }
      )
    }

    const stripe = getStripe()
    try {
      await stripe.subscriptions.retrieve(subscriptionId)
    } catch {
      return NextResponse.json({ error: 'Subscription not found on Stripe. It may have been already cancelled.' }, { status: 404 })
    }

    let result
    const actionLower = action.toLowerCase()

    if (actionLower === 'cancel') {
      result = await stripe.subscriptions.del(subscriptionId)

      const today = new Date().toISOString().split('T')[0]
      await supabase
        .from('profiles')
        .update({
          is_premium: false,
          membership_end_date: today,
        })
        .eq('id', userId)

      await supabase
        .from('memberships')
        .update({ status: 'cancelled', auto_renew: false })
        .eq('stripe_subscription_id', subscriptionId)
    } else {
      result = await stripe.subscriptions.update(subscriptionId, {
        pause_collection: { behavior: 'mark_uncollectible' },
      })

      await supabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('id', userId)

      await supabase
        .from('memberships')
        .update({ status: 'paused' })
        .eq('stripe_subscription_id', subscriptionId)
    }

    const effectiveDate = new Date(result.current_period_end * 1000)
      .toISOString()
      .split('T')[0]

    return NextResponse.json({
      subscriptionId: result.id,
      action: actionLower,
      status: result.status,
      effectiveDate,
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
