import { createClient } from '@/lib/supabaseClient'
import { getOrSet, cacheKey, invalidatePrefix, TTL } from '@/lib/cache'

const CACHE_PREFIX = 'content'

// ─── Videos ───

export async function getVideos() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'videos'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('videos').select('*').order('upload_date', { ascending: false })
    if (error) throw error
    return data
  }, TTL.VIDEOS)
}

export async function createVideo(video) {
  const supabase = createClient()
  const { data, error } = await supabase.from('videos').insert(video).select().single()
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return data
}

export async function deleteVideo(id) {
  const supabase = createClient()
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
}

// ─── Podcasts ───

export async function getPodcasts() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'podcasts'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('podcasts').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.PODCASTS)
}

export async function createPodcast(podcast) {
  const supabase = createClient()
  const { data, error } = await supabase.from('podcasts').insert(podcast).select().single()
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return data
}

export async function deletePodcast(id) {
  const supabase = createClient()
  const { error } = await supabase.from('podcasts').delete().eq('id', id)
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
}

// ─── Affirmations ───

export async function getLatestAffirmation() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'affirmation', 'latest'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data || null
  }, TTL.AFFIRMATIONS)
}

export async function getAffirmations({ limit = 50 } = {}) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'affirmations', `limit-${limit}`), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  }, TTL.AFFIRMATIONS)
}

export async function createAffirmation(affirmation) {
  const supabase = createClient()
  const { data, error } = await supabase.from('affirmations').insert(affirmation).select().single()
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return data
}

export async function deleteAffirmation(id) {
  const supabase = createClient()
  const { error } = await supabase.from('affirmations').delete().eq('id', id)
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
}

// ─── Community Posts ───

export async function getCommunityPosts() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'community-posts'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data
  }, TTL.COMMUNITY_POSTS)
}

export async function createCommunityPost(post) {
  const supabase = createClient()
  const { data, error } = await supabase.from('community_posts').insert(post).select().single()
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return data
}

export async function likePost(postId) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('increment_likes', { post_id: postId })
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return data
}

// ─── Success Stories ───

export async function getSuccessStories() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'success-stories'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('success_stories').select('*')
    if (error) throw error
    return data
  }, TTL.VIDEOS)
}

// ─── Attire Recommendations ───

export async function getAttireRecommendations() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'attire'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('attire_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) throw error
    return data
  }, TTL.ATTIRE)
}

export async function createAttireRecommendation(rec) {
  const supabase = createClient()
  const { data, error } = await supabase.from('attire_recommendations').insert(rec).select().single()
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return data
}

// ─── Apparel Products ───

export async function getApparelProducts() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'apparel'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('apparel_products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return data
  }, TTL.APPAREL)
}
