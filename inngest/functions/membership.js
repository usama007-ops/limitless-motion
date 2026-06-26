import { inngest } from '../client'
import { getAdminClient } from '@/lib/supabaseAdmin'
import { stripe } from '@/lib/stripe'

export const syncAllSubscriptions = inngest.createFunction(
  {
    id: 'sync-all-subscriptions',
    name: 'Sync All Subscriptions from Stripe',
  },
  { cron: '0 */6 * * *' },
  async ({ step }) => {
    const supabase = getAdminClient()

    const { data: profiles } = await step.run('fetch-profiles-with-subscriptions', async () => {
      return await supabase
        .from('profiles')
        .select('id, stripe_customer_id, stripe_subscription_id')
        .not('stripe_subscription_id', 'is', null)
    })

    if (!profiles || profiles.length === 0) {
      return { skipped: true, reason: 'No profiles with subscriptions' }
    }

    let updated = 0
    let failed = 0

    for (const profile of profiles) {
      try {
        await step.run(`sync-sub-${profile.id}`, async () => {
          const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
          const status = subscription.status
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString()

          await supabase
            .from('profiles')
            .update({
              stripe_subscription_status: status,
              stripe_subscription_end: currentPeriodEnd,
              is_premium: status === 'active' || status === 'trialing',
            })
            .eq('id', profile.id)
        })
        updated++
      } catch (err) {
        console.error(`Failed to sync subscription ${profile.stripe_subscription_id}:`, err)
        failed++
      }
    }

    return { processed: true, total: profiles.length, updated, failed }
  }
)

export const checkExpiredMemberships = inngest.createFunction(
  {
    id: 'check-expired-memberships',
    name: 'Check and Mark Expired Memberships',
  },
  { cron: '0 0 * * *' },
  async ({ step }) => {
    const supabase = getAdminClient()

    const { data: expiredProfiles } = await step.run('fetch-expired-profiles', async () => {
      const now = new Date().toISOString()
      return await supabase
        .from('profiles')
        .select('id, stripe_subscription_status, stripe_subscription_end')
        .eq('is_premium', true)
        .lt('stripe_subscription_end', now)
    })

    if (!expiredProfiles || expiredProfiles.length === 0) {
      return { skipped: true, reason: 'No expired memberships found' }
    }

    for (const profile of expiredProfiles) {
      await step.run(`mark-expired-${profile.id}`, async () => {
        await supabase
          .from('profiles')
          .update({
            is_premium: false,
            stripe_subscription_status: 'expired',
          })
          .eq('id', profile.id)
      })
    }

    return { processed: true, expiredCount: expiredProfiles.length }
  }
)
