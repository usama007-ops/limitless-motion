import { createClient } from '@/lib/supabaseClient'
import { getOrSet, cacheKey, invalidatePrefix, TTL } from '@/lib/cache'

const CACHE_PREFIX = 'workouts'

// ─── Workout Programs ───

export async function getWorkoutPrograms({ category, social } = {}) {
  const key = cacheKey(CACHE_PREFIX, 'programs', category || 'all', social !== undefined ? `social-${social}` : 'all')
  return getOrSet(key, async () => {
    const supabase = createClient()
    let query = supabase.from('workout_programs').select('*').order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (social !== undefined) query = query.eq('social', social)

    const { data, error } = await query
    if (error) throw error
    return data
  }, TTL.WORKOUT_PROGRAMS)
}

export async function getWorkoutProgram(id) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'program', id), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('workout_programs').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }, TTL.WORKOUT_PROGRAMS)
}

// ─── Workout Days ───

export async function getWorkoutDays(programId) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'days', programId), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workout_days')
      .select('*, workout_programs(*)')
      .eq('program_id', programId)
      .order('day_of_week')
    if (error) throw error
    return data
  }, TTL.WORKOUT_DAYS)
}

export async function getWorkoutDay(id) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'day', id), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workout_days')
      .select('*, workout_programs(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }, TTL.WORKOUT_DAYS)
}

export async function getWorkoutDayByProgramAndDay(programId, dayOfWeek) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'program-day', programId, String(dayOfWeek)), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workout_days')
      .select('*')
      .eq('program_id', programId)
      .eq('day_of_week', dayOfWeek)
      .single()
    if (error) throw error
    return data
  }, TTL.WORKOUT_DAYS)
}

// ─── Exercises ───

export async function getExercisesByDay(dayId) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'exercises', dayId), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('day_id', dayId)
      .order('created_at')
    if (error) throw error
    return data
  }, TTL.EXERCISES)
}

// ─── User Workouts (logged) ───

export async function getUserWorkouts(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function createWorkout(workout) {
  const supabase = createClient()
  const { data, error } = await supabase.from('workouts').insert(workout).select().single()
  if (error) throw error
  return data
}

export async function updateWorkout(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase.from('workouts').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteWorkout(id) {
  const supabase = createClient()
  const { error } = await supabase.from('workouts').delete().eq('id', id)
  if (error) throw error
}

// ─── User Workout Progress ───

export async function getUserWorkoutProgress(userId, { categoryFilter } = {}) {
  const supabase = createClient()
  let query = supabase
    .from('user_workout_progress')
    .select('*, workout_programs(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error

  if (categoryFilter) {
    return data.filter(p => p.workout_programs?.category === categoryFilter)
  }

  return data
}

// ─── Workout Videos ───

export async function getWorkoutVideos() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'videos'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('workout_videos').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.VIDEOS)
}

export async function createWorkoutVideo(video) {
  const supabase = createClient()
  const { data, error } = await supabase.from('workout_videos').insert(video).select().single()
  if (error) throw error
  return data
}

// ─── Recovery Flows ───

// ─── Workout Challenges ───

export async function getWorkoutChallenges() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'challenges'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('workout_challenges').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.CHALLENGES)
}

export async function getRecoveryFlows() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'recovery'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('recovery_flows').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.WORKOUT_PROGRAMS)
}
