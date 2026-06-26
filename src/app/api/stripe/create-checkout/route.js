import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request) {
  try {
    const { items, successUrl, cancelUrl, productName, amount } = await request.json()

    let lineItems = []

    if (items && Array.isArray(items) && items.length > 0) {
      if (!successUrl || !cancelUrl) {
        return NextResponse.json(
          { error: 'Missing required fields: items, successUrl, cancelUrl' },
          { status: 400 }
        )
      }

      lineItems = items.map((item) => {
        if (!item.name || !item.price || !item.quantity) {
          throw new Error('Each item must have name, price, and quantity')
        }

        return {
          price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }
      })
    } else if (amount && productName) {
      if (!successUrl || !cancelUrl) {
        return NextResponse.json(
          { error: 'Missing required fields: amount, productName, successUrl, cancelUrl' },
          { status: 400 }
        )
      }

      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ]
    } else {
      return NextResponse.json(
        { error: 'Missing required fields: either (items, successUrl, cancelUrl) or (amount, productName, successUrl, cancelUrl)' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Create checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
