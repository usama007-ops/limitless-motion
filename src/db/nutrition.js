import { createClient } from '@/lib/supabaseClient'
import { getOrSet, cacheKey, invalidatePrefix, TTL } from '@/lib/cache'

const CACHE_PREFIX = 'nutrition'

async function mealFetch(table, params = {}) {
  const q = new URLSearchParams({ table })
  if (params.season) q.set('season', params.season)
  if (params.category) q.set('category', params.category)
  if (params.sortBy) q.set('sortBy', params.sortBy)
  if (params.ascending) q.set('ascending', 'true')
  if (params.limit) q.set('limit', String(params.limit))

  const res = await fetch(`/api/meals?${q}`)
  if (!res.ok) throw new Error(`Failed to fetch ${table}`)
  const { data } = await res.json()
  return data
}

// ─── Meal Recipes ───

export async function getMealRecipes() {
  return getOrSet(cacheKey(CACHE_PREFIX, 'meal-recipes'), () => mealFetch('meal_recipes'), TTL.RECIPES)
}

export async function getMealRecipesSorted(sortBy = 'calories_total', ascending = false) {
  return getOrSet(
    cacheKey(CACHE_PREFIX, 'meal-recipes', sortBy, ascending ? 'asc' : 'desc'),
    () => mealFetch('meal_recipes', { sortBy, ascending }),
    TTL.RECIPES
  )
}

export async function getMealRecipesBySeason(season) {
  return getOrSet(
    cacheKey(CACHE_PREFIX, 'meal-recipes', 'season', season),
    () => mealFetch('meal_recipes', { season }),
    TTL.RECIPES
  )
}

// ─── Ethiopian Meals ───

export async function getEthiopianMeals() {
  return getOrSet(
    cacheKey(CACHE_PREFIX, 'ethiopian-meals'),
    () => mealFetch('ethiopian_meals', { sortBy: 'created_at', ascending: false }),
    TTL.MEALS
  )
}

// ─── High Protein Meals ───

export async function getHighProteinMeals({ category, limit } = {}) {
  const key = cacheKey(CACHE_PREFIX, 'high-protein', category || 'all', limit ? `limit-${limit}` : 'all')
  return getOrSet(
    key,
    () => mealFetch('high_protein_meals', { sortBy: 'protein_grams', ascending: false, category, limit }),
    TTL.MEALS
  )
}

// ─── Fasting Breakfasts ───

export async function getFastingBreakfasts({ category } = {}) {
  const key = cacheKey(CACHE_PREFIX, 'fasting-breakfasts', category || 'all')
  return getOrSet(
    key,
    () => mealFetch('fasting_breakfasts', { sortBy: 'created_at', ascending: false, category }),
    TTL.MEALS
  )
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
