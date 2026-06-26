import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { inngest } from '../../../../../inngest/client'

export async function POST(request) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event
    try {
      event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
    }

    console.log(`Webhook event received: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed':
        await inngest.send({
          name: 'stripe/checkout.completed',
          data: { sessionId: event.data.object.id },
        })
        break

      case 'customer.subscription.updated':
        await inngest.send({
          name: 'stripe/subscription.updated',
          data: { subscriptionId: event.data.object.id },
        })
        break

      case 'invoice.payment_succeeded':
        await inngest.send({
          name: 'stripe/invoice.paid',
          data: { invoiceId: event.data.object.id },
        })
        break

      case 'invoice.payment_failed':
        await inngest.send({
          name: 'stripe/invoice.payment-failed',
          data: { invoiceId: event.data.object.id },
        })
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
