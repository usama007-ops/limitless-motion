import { createClient } from '@/lib/supabaseClient'
import { getOrSet, cacheKey, invalidatePrefix, TTL } from '@/lib/cache'

const CACHE_PREFIX = 'nutrition'

// ─── Meal Recipes ───

export async function getMealRecipes() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'meal-recipes'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('meal_recipes').select('*')
    if (error) throw error
    return data
  }, TTL.RECIPES)
}

export async function getMealRecipesSorted(sortBy = 'calories_total', ascending = false) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'meal-recipes', sortBy, ascending ? 'asc' : 'desc'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('meal_recipes')
      .select('*')
      .order(sortBy, { ascending })
    if (error) throw error
    return data
  }, TTL.RECIPES)
}

export async function getMealRecipesBySeason(season) {
  return getOrSet(cacheKey(CACHE_PREFIX, 'meal-recipes', 'season', season), async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('meal_recipes')
      .select('*')
      .eq('season', season)
    if (error) throw error
    return data
  }, TTL.RECIPES)
}

// ─── Ethiopian Meals ───

export async function getEthiopianMeals() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'ethiopian-meals'), async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from('ethiopian_meals').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, TTL.MEALS)
}

// ─── High Protein Meals ───

export async function getHighProteinMeals({ category, limit } = {}) {
  const key = cacheKey(CACHE_PREFIX, 'high-protein', category || 'all', limit ? `limit-${limit}` : 'all')
  return getOrSet(key, async () => {
    const supabase = createClient()
    let query = supabase.from('high_protein_meals').select('*').order('protein_grams', { ascending: false })

    if (category) query = query.eq('category', category)
    if (limit) query = query.limit(limit)

    const { data, error } = await query
    if (error) throw error
    return data
  }, TTL.MEALS)
}

// ─── Fasting Breakfasts ───

export async function getFastingBreakfasts({ category } = {}) {
  const key = cacheKey(CACHE_PREFIX, 'fasting-breakfasts', category || 'all')
  return getOrSet(key, async () => {
    const supabase = createClient()
    let query = supabase.from('fasting_breakfasts').select('*').order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)

    const { data, error } = await query
    if (error) throw error
    return data
  }, TTL.MEALS)
}

// ─── Macro Goals ───

export async function createMacroGoals(goals) {
  const supabase = createClient()
  const { data, error } = await supabase.from('macro_goals').insert(goals).select().single()
  if (error) throw error
  return data
}

export async function updateMacroGoals(id, updates) {
  const supabase = createClient()
  const { data, error } = await supabase.from('macro_goals').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ─── Meal Plans ───

export async function getUserMealPlans(userId) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*, macro_goals(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createMealPlan(plan) {
  const supabase = createClient()
  const { data, error } = await supabase.from('meal_plans').insert(plan).select().single()
  if (error) throw error
  return data
}
