import { createClient } from '@/lib/supabaseClient'
import { getOrSet, cacheKey, invalidatePrefix, TTL } from '@/lib/cache'

const CACHE_PREFIX = 'billing'

// ─── Profile / User (Stripe fields) ───

export async function getProfile(userId) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'profile', userId), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) throw error
    return data
  }, TTL.PROFILE)
}

export async function updateProfile(userId, updates) {
  const supabase = createClient()
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()
  if (error) throw error
  await invalidatePrefix(cacheKey(CACHE_PREFIX, 'profile', userId))
  return data
}

// ─── Memberships ───

export async function getUserMemberships(userId) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'memberships', userId), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.MEMBERSHIPS)
}

export async function createMembership(membership) {
  const supabase = createClient()
  const { data, error } = await supabase.from('memberships').insert(membership).select().single()
  if (error) throw error
  return data
}

// ─── Payment Methods ───

export async function getPaymentMethods(userId) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'payment-methods', userId), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
    if (error) throw error
    return data
  }, TTL.PAYMENT_HISTORY)
}

// ─── Payment History ───

export async function getPaymentHistory(userId, { page = 1, limit = 10, startDate, endDate } = {}) {
  const key = cacheKey(CACHE_PREFIX, 'payment-history', userId, `page-${page}`, `limit-${limit}`)
  return getOrSet(key, async () => {
    const supabase = createClient()
    let query = supabase
      .from('payment_history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error, count } = await query
    if (error) throw error

    return {
      items: data,
      pagination: { page, perPage: limit, totalItems: count, totalPages: Math.ceil((count || 0) / limit) },
    }
  }, TTL.PAYMENT_HISTORY)
}

export async function createPaymentHistory(record) {
  const supabase = createClient()
  const { data, error } = await supabase.from('payment_history').insert(record).select().single()
  if (error) throw error
  return data
}

// ─── Coaching Bookings ───

export async function createCoachingBooking(booking) {
  const supabase = createClient()
  const { data, error } = await supabase.from('coaching_bookings').insert(booking).select().single()
  if (error) throw error
  return data
}

// ─── Terms Acceptance ───

export async function createTermsAcceptance(record) {
  const supabase = createClient()
  const { data, error } = await supabase.from('terms_acceptance').insert(record).select().single()
  if (error) throw error
  return data
}
