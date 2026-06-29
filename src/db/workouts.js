import { createClient } from '@/lib/supabaseClient'
import { getOrSet, cacheKey, invalidatePrefix, TTL } from '@/lib/cache'

function localDateStr(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

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
      .order('week_number')
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

export async function getExercises() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'all-exercises'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('exercises')
      .select('*, workout_programs(name)')
      .order('created_at')
    if (error) throw error
    return data
  }, TTL.EXERCISES)
}

export async function getExercisesByProgram(programId) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'program-exercises', programId), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('program_id', programId)
      .order('created_at')
    if (error) throw error
    return data
  }, TTL.EXERCISES)
}

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

export async function upsertUserWorkoutProgress(userId, { program_id, day_id, completed_exercises, weights = {} }) {
  const supabase = createClient()
  const { data: existing } = await supabase
    .from('user_workout_progress')
    .select('id, completed_days')
    .eq('user_id', userId)
    .eq('program_id', program_id)
    .maybeSingle()

  if (existing) {
    const currDays = existing.completed_days || []
    const mergedDays = currDays.includes(day_id) ? currDays : [...currDays, day_id]
    const { data, error } = await supabase
      .from('user_workout_progress')
      .update({
        current_day: mergedDays.length,
        completed_exercises,
        completed_days: mergedDays,
        weights,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('*, workout_programs(*)')
      .single()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from('user_workout_progress')
    .insert({
      user_id: userId,
      program_id,
      current_day: 1,
      completed_exercises,
      completed_days: [day_id],
      weights,
      start_date: localDateStr(),
    })
    .select('*, workout_programs(*)')
    .single()
  if (error) throw error
  return data
}

export async function getWeeklyActivity(userId) {
  const supabase = createClient()
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const { data, error } = await supabase
    .from('workouts')
    .select('date')
    .eq('user_id', userId)
    .gte('date', localDateStr(sevenDaysAgo))
    .lte('date', localDateStr(today))
  if (error) throw error

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const activityMap = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    const key = localDateStr(d)
    activityMap[key] = { name: dayNames[d.getDay()], workouts: 0 }
  }

  if (data) {
    const seen = new Set()
    for (const w of data) {
      const key = w.date
      if (!seen.has(key)) {
        seen.add(key)
        if (activityMap[key]) activityMap[key].workouts++
      }
    }
  }

  return Object.values(activityMap)
}

export async function getWorkoutStreak(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error

  if (!data || data.length === 0) return { currentStreak: 0, longestStreak: 0 }

  const uniqueDates = [...new Set(data.map(w => w.date))].sort().reverse()

  let currentStreak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i] + 'T00:00:00')
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    expected.setHours(0, 0, 0, 0)
    if (d.getTime() === expected.getTime()) {
      currentStreak++
    } else {
      break
    }
  }

  let longestStreak = 0
  let tempStreak = 1
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1] + 'T00:00:00')
    const curr = new Date(uniqueDates[i] + 'T00:00:00')
    const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  return { currentStreak, longestStreak }
}

export async function getWorkoutStats(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error

  const totalWorkouts = data ? new Set(data.map(w => w.date)).size : 0
  const recentWorkouts = (data || []).slice(0, 10).map(w => ({
    id: w.id,
    exerciseName: w.exercise_name,
    sets: w.sets,
    reps: w.reps,
    weight: w.weight,
    weightUnit: w.weight_unit,
    date: w.date,
  }))

  return { totalWorkouts, recentWorkouts }
}

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

// ─── Workout Challenges ───

export async function getWorkoutChallenges() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'challenges'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('workout_challenges').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.CHALLENGES)
}

export async function joinChallenge(userId, challengeId) {
  const supabase = createClient()
  const { data: existing } = await supabase
    .from('challenge_participants')
    .select('id')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .maybeSingle()
  if (existing) throw new Error('Already joined this challenge')

  const { data, error } = await supabase
    .from('challenge_participants')
    .insert({
      user_id: userId,
      challenge_id: challengeId,
      joined_date: localDateStr(),
      completion_status: 'in-progress',
      progress_percent: 0,
    })
    .select()
    .single()
  if (error) throw error

  const { data: challenge } = await supabase.from('workout_challenges').select('participant_count').eq('id', challengeId).single()
  if (challenge) {
    await supabase.from('workout_challenges').update({ participant_count: (challenge.participant_count || 0) + 1 }).eq('id', challengeId)
  }

  await invalidatePrefix(CACHE_PREFIX)
  return data
}

// ─── Recovery Flows ───

export async function getRecoveryFlows() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'recovery'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('recovery_flows').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.WORKOUT_PROGRAMS)
}
