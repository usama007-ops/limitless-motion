import { inngest } from '../client'
import { getAdminClient } from '@/lib/supabaseAdmin'
import { getStripe } from '@/lib/stripe'

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
          const subscription = await getStripe().subscriptions.retrieve(profile.stripe_subscription_id)
          const status = subscription.status
          const isActive = status === 'active' || status === 'trialing'
          const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0]

          let tier = 'premium'
          const productId = subscription.items?.data?.[0]?.price?.product
          if (productId) {
            const name = (subscription.items?.data?.[0]?.price?.nickname || '').toLowerCase()
            if (name.includes('elite')) tier = 'elite'
            else if (name.includes('basic')) tier = 'basic'
          }

          await supabase
            .from('profiles')
            .update({
              is_premium: isActive,
              current_tier: tier,
              membership_end_date: currentPeriodEnd,
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
      const today = new Date().toISOString().split('T')[0]
      return await supabase
        .from('profiles')
        .select('id')
        .eq('is_premium', true)
        .lt('membership_end_date', today)
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
            current_tier: null,
          })
          .eq('id', profile.id)
      })
    }

    return { processed: true, expiredCount: expiredProfiles.length }
  }
)
