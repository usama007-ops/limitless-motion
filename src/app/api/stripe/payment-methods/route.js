import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getAdminClient } from '@/lib/supabaseAdmin'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
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

    const paymentMethods = []

    if (profile.stripe_customer_id) {
      const stripePaymentMethods = await stripe.paymentMethods.list({
        customer: profile.stripe_customer_id,
        type: 'card',
      })

      stripePaymentMethods.data.forEach((pm) => {
        paymentMethods.push({
          id: pm.id,
          type: pm.type,
          last4Digits: pm.card.last4,
          brand: pm.card.brand,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
          isDefault: pm.id === profile.default_payment_method_id,
        })
      })
    }

    const { data: pbPaymentMethods } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)

    if (pbPaymentMethods) {
      pbPaymentMethods.forEach((pm) => {
        if (!paymentMethods.find((spm) => spm.id === pm.stripe_payment_method_id)) {
          paymentMethods.push({
            id: pm.stripe_payment_method_id,
            type: pm.type,
            last4Digits: pm.last4_digits,
            brand: pm.brand,
            expMonth: pm.expiry_month,
            expYear: pm.expiry_year,
            isDefault: pm.is_default,
          })
        }
      })
    }

    return NextResponse.json(paymentMethods)
  } catch (error) {
    console.error('Payment methods error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
