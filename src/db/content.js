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
  const now = new Date()
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  const etMs = utcMs + (-4 * 3600000)
  const etDate = new Date(etMs)
  etDate.setHours(etDate.getHours() - 6)
  const daySeed = `${etDate.getFullYear()}-${String(etDate.getMonth()+1).padStart(2,'0')}-${String(etDate.getDate()).padStart(2,'0')}`

  return getOrSet(cacheKey(CACHE_PREFIX, 'affirmation', 'daily', daySeed), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('affirmations').select('*')
    if (error) throw error
    if (!data || data.length === 0) return null

    let hash = 0
    for (let i = 0; i < daySeed.length; i++) {
      hash = ((hash << 5) - hash) + daySeed.charCodeAt(i)
      hash |= 0
    }
    return data[Math.abs(hash) % data.length]
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

export async function likePost(postId, userId) {
  const supabase = createClient()
  const { data: post, error: fetchErr } = await supabase
    .from('community_posts')
    .select('likes, liked_by')
    .eq('id', postId)
    .single()
  if (fetchErr) throw fetchErr

  const likedBy = post.liked_by || []
  if (userId && likedBy.includes(userId)) {
    throw new Error('Already liked')
  }

  const update = userId
    ? { likes: (post.likes || 0) + 1, liked_by: [...likedBy, userId] }
    : { likes: (post.likes || 0) + 1 }

  const { error } = await supabase
    .from('community_posts')
    .update(update)
    .eq('id', postId)
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
}

// ─── Comments ───

export async function addComment(postId, { authorName, content }) {
  const supabase = createClient()
  const { data: post, error: fetchErr } = await supabase
    .from('community_posts')
    .select('comments')
    .eq('id', postId)
    .single()
  if (fetchErr) throw fetchErr

  const comment = {
    id: crypto.randomUUID(),
    author_name: authorName,
    content,
    created: new Date().toISOString(),
    replies: [],
  }
  const comments = [...(post.comments || []), comment]
  const { error } = await supabase
    .from('community_posts')
    .update({ comments })
    .eq('id', postId)
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return comment
}

export async function addReply(postId, parentCommentId, { authorName, content }) {
  const supabase = createClient()
  const { data: post, error: fetchErr } = await supabase
    .from('community_posts')
    .select('comments')
    .eq('id', postId)
    .single()
  if (fetchErr) throw fetchErr

  function insertReply(comments, parentId, reply) {
    return comments.map(c => {
      if (c.id === parentId) {
        return { ...c, replies: [...(c.replies || []), reply] }
      }
      if (c.replies?.length) {
        return { ...c, replies: insertReply(c.replies, parentId, reply) }
      }
      return c
    })
  }

  const reply = {
    id: crypto.randomUUID(),
    author_name: authorName,
    content,
    created: new Date().toISOString(),
    replies: [],
  }
  const comments = insertReply(post.comments || [], parentCommentId, reply)
  const { error } = await supabase
    .from('community_posts')
    .update({ comments })
    .eq('id', postId)
  if (error) throw error
  await invalidatePrefix(CACHE_PREFIX)
  return { comments }
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
