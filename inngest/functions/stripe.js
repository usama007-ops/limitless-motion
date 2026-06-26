import { inngest } from '../client'
import { getAdminClient } from '@/lib/supabaseAdmin'
import { getStripe } from '@/lib/stripe'

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

    await step.run('update-profile', async () => {
      const supabase = getAdminClient()
      const updates = { stripe_customer_id: customerId }
      if (subscriptionId) updates.stripe_subscription_id = subscriptionId
      await supabase.from('profiles').update(updates).eq('id', userId)
    })

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
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

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
            stripe_subscription_id: subscriptionId,
            stripe_subscription_status: status,
            stripe_subscription_end: currentPeriodEnd,
            is_premium: status === 'active' || status === 'trialing',
          })
          .eq('id', profiles[0].id)
      }
    })

    return { processed: true, customerId, status }
  }
)

export const handleInvoicePaid = inngest.createFunction(
  { id: 'handle-invoice-paid', name: 'Handle Invoice Payment Succeeded' },
  { event: 'stripe/invoice.paid' },
  async ({ event, step }) => {
    const { invoiceId } = event.data

    const invoice = await step.run('fetch-invoice', async () => {
      return await stripe.invoices.retrieve(invoiceId)
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
          invoice_id: invoiceId,
          amount: amount / 100,
          currency: invoice.currency,
          status: 'completed',
          receipt_url: invoice.receipt_url,
          description: `Invoice ${invoiceId}`,
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
      return await stripe.invoices.retrieve(invoiceId)
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
          invoice_id: invoiceId,
          amount: amount / 100,
          currency: invoice.currency,
          status: 'failed',
          receipt_url: invoice.receipt_url,
          description: `Failed invoice ${invoiceId}`,
        })
      }
    })

    return { processed: true, invoiceId }
  }
)
