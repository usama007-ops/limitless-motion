import { inngest } from '../client'
import { getAdminClient } from '@/lib/supabaseAdmin'
import { getStripe } from '@/lib/stripe'

function tierFromSubscription(sub) {
  const productId = sub.items?.data?.[0]?.price?.product
  if (!productId) return 'premium'
  const name = (sub.items?.data?.[0]?.price?.nickname || '').toLowerCase()
  if (name.includes('elite')) return 'elite'
  if (name.includes('premium')) return 'premium'
  if (name.includes('basic')) return 'basic'
  return 'premium'
}

export const handleCheckoutCompleted = inngest.createFunction(
  { id: 'handle-checkout-completed', name: 'Handle Checkout Session Completed' },
  { event: 'stripe/checkout.completed' },
  async ({ event, step }) => {
    const { sessionId } = event.data

    const session = await step.run('fetch-session', async () => {
      return await getStripe().checkout.sessions.retrieve(sessionId)
    })

    const customerId = session.customer
    const userId = session.client_reference_id
    const subscriptionId = session.subscription

    if (!userId) {
      return { skipped: true, reason: 'No client_reference_id' }
    }

    const tier = (session.metadata?.tier || 'premium')

    await step.run('update-profile', async () => {
      const supabase = getAdminClient()
      const updates = {
        stripe_customer_id: customerId,
        is_premium: true,
        current_tier: tier,
      }
      if (subscriptionId) updates.stripe_subscription_id = subscriptionId
      await supabase.from('profiles').update(updates).eq('id', userId)
    })

    if (subscriptionId) {
      await step.run('create-membership', async () => {
        const supabase = getAdminClient()
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
          auto_renew: true,
        }

        if (existing) {
          await supabase.from('memberships').update(membership).eq('id', existing.id)
        } else {
          await supabase.from('memberships').insert(membership)
        }
      })
    }

    return { completed: true, userId, customerId, subscriptionId }
  }
)

export const handleSubscriptionUpdated = inngest.createFunction(
  { id: 'handle-subscription-updated', name: 'Handle Subscription Updated' },
  { event: 'stripe/subscription.updated' },
  async ({ event, step }) => {
    const { subscriptionId } = event.data

    const subscription = await step.run('fetch-subscription', async () => {
      return await getStripe().subscriptions.retrieve(subscriptionId)
    })

    const customerId = subscription.customer
    const status = subscription.status
    const isActive = status === 'active' || status === 'trialing'
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0]
    const tier = tierFromSubscription(subscription)

    await step.run('update-profile', async () => {
      const supabase = getAdminClient()
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (profiles && profiles.length > 0) {
        await supabase
          .from('profiles')
          .update({
            is_premium: isActive,
            current_tier: tier,
            membership_end_date: currentPeriodEnd,
          })
          .eq('id', profiles[0].id)
      }
    })

    await step.run('upsert-membership', async () => {
      const supabase = getAdminClient()
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (profiles && profiles.length > 0) {
        const userId = profiles[0].id
        const { data: existing } = await supabase
          .from('memberships')
          .select('id')
          .eq('stripe_subscription_id', subscriptionId)
          .maybeSingle()

        const membership = {
          user_id: userId,
          tier: tier.charAt(0).toUpperCase() + tier.slice(1),
          status: isActive ? 'active' : 'cancelled',
          stripe_subscription_id: subscriptionId,
          renewal_date: currentPeriodEnd,
          auto_renew: isActive,
        }

        if (existing) {
          await supabase.from('memberships').update(membership).eq('id', existing.id)
        } else {
          await supabase.from('memberships').insert(membership)
        }
      }
    })

    return { processed: true, customerId, status, tier }
  }
)

export const handleInvoicePaid = inngest.createFunction(
  { id: 'handle-invoice-paid', name: 'Handle Invoice Payment Succeeded' },
  { event: 'stripe/invoice.paid' },
  async ({ event, step }) => {
    const { invoiceId } = event.data

    const invoice = await step.run('fetch-invoice', async () => {
      return await getStripe().invoices.retrieve(invoiceId)
    })

    const customerId = invoice.customer
    const amount = invoice.amount_paid

    await step.run('insert-payment-history', async () => {
      const supabase = getAdminClient()
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (profiles && profiles.length > 0) {
        await supabase.from('payment_history').insert({
          user_id: profiles[0].id,
          amount: amount / 100,
          currency: invoice.currency,
          status: 'completed',
          receipt_url: invoice.receipt_url,
        })
      }
    })

    return { processed: true, invoiceId }
  }
)

export const handleInvoicePaymentFailed = inngest.createFunction(
  { id: 'handle-invoice-payment-failed', name: 'Handle Invoice Payment Failed' },
  { event: 'stripe/invoice.payment-failed' },
  async ({ event, step }) => {
    const { invoiceId } = event.data

    const invoice = await step.run('fetch-invoice', async () => {
      return await getStripe().invoices.retrieve(invoiceId)
    })

    const customerId = invoice.customer
    const amount = invoice.amount_due

    await step.run('insert-failed-payment', async () => {
      const supabase = getAdminClient()
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)

      if (profiles && profiles.length > 0) {
        await supabase.from('payment_history').insert({
          user_id: profiles[0].id,
          amount: amount / 100,
          currency: invoice.currency,
          status: 'failed',
          receipt_url: invoice.receipt_url,
        })
      }
    })

    return { processed: true, invoiceId }
  }
)
