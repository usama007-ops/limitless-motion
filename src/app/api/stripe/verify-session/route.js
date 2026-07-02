import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getAdminClient } from '@/lib/supabaseAdmin'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const userId = session.client_reference_id
    if (!userId) {
      return NextResponse.json({ error: 'No client_reference_id in session' }, { status: 400 })
    }

    const subscriptionId = session.subscription
    const customerId = session.customer
    const tier = (session.metadata?.tier || 'premium')

    const supabase = getAdminClient()

    let currentPeriodEnd = null
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId)
      currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString().split('T')[0]
    }

    const updates = {
      stripe_customer_id: customerId,
      is_premium: true,
      current_tier: tier,
    }
    if (subscriptionId) updates.stripe_subscription_id = subscriptionId
    if (currentPeriodEnd) updates.membership_end_date = currentPeriodEnd
    await supabase.from('profiles').update(updates).eq('id', userId)

    if (subscriptionId) {
      const { data: existing } = await supabase
        .from('memberships')
        .select('id')
        .eq('stripe_subscription_id', subscriptionId)
        .maybeSingle()

      const membership = {
        user_id: userId,
        tier: tier.charAt(0).toUpperCase() + tier.slice(1),
        status: 'active',
        stripe_subscription_id: subscriptionId,
        start_date: new Date().toISOString().split('T')[0],
        renewal_date: currentPeriodEnd,
        auto_renew: true,
      }

      if (existing) {
        await supabase.from('memberships').update(membership).eq('id', existing.id)
      } else {
        await supabase.from('memberships').insert(membership)
      }
    }

    const invoice = session.invoice
    if (invoice) {
      const stripeInvoice = typeof invoice === 'string'
        ? await stripe.invoices.retrieve(invoice)
        : invoice

      await supabase.from('payment_history').insert({
        user_id: userId,
        amount: stripeInvoice.amount_paid / 100,
        currency: stripeInvoice.currency || 'usd',
        status: 'completed',
        receipt_url: stripeInvoice.receipt_url,
      })
    }

    return NextResponse.json({ verified: true, userId, tier })
  } catch (error) {
    console.error('Verify session error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
