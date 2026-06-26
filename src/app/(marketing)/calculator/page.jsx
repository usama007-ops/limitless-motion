'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calculator, Activity, Target, RefreshCw, Loader2, AlertCircle, ArrowRight, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import FoodRecommendationCard from '@/components/meal-plan/FoodRecommendationCard.jsx'
import { getMealRecipes } from '@/db'

const fallbackMeals = [
  {
    id: 'meal-1',
    name: 'Grilled Chicken & Quinoa Bowl',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    caloriesTotal: 520,
    proteinGrams: 42,
    carbsGrams: 58,
    fatsGrams: 12
  },
  {
    id: 'meal-2',
    name: 'Salmon with Sweet Potato & Asparagus',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    caloriesTotal: 580,
    proteinGrams: 48,
    carbsGrams: 45,
    fatsGrams: 18
  },
  {
    id: 'meal-3',
    name: 'Lean Beef Stir-Fry with Brown Rice',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
    caloriesTotal: 490,
    proteinGrams: 44,
    carbsGrams: 50,
    fatsGrams: 10
  },
  {
    id: 'meal-4',
    name: 'Greek Yogurt & Berry Protein Parfait',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    caloriesTotal: 380,
    proteinGrams: 35,
    carbsGrams: 40,
    fatsGrams: 6
  },
  {
    id: 'meal-5',
    name: 'Turkey & Avocado Wrap',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
    caloriesTotal: 440,
    proteinGrams: 36,
    carbsGrams: 38,
    fatsGrams: 14
  },
  {
    id: 'meal-6',
    name: 'Veggie & Tofu Buddha Bowl',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    caloriesTotal: 420,
    proteinGrams: 22,
    carbsGrams: 55,
    fatsGrams: 16
  }
]

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9
}

const GOAL_ADJUSTMENTS = {
  fat_loss: -500,
  maintenance: 0,
  muscle_gain: 500
}

const MacroCalculator = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)

  const [recommendations, setRecommendations] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [mealOptions, setMealOptions] = useState(null)

  const [formData, setFormData] = useState({
    weight: '',
    weightUnit: 'lbs',
    height: '',
    heightUnit: 'in',
    age: '',
    gender: 'male',
    activity: 'moderate',
    goal: 'fat_loss'
  })

  useEffect(() => {
    document.title = 'TDEE & Macro Calculator - Limitless Motion'
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const data = await getMealRecipes()
        if (data && data.length > 0) {
          setMealOptions(data.map(m => ({
            ...m,
            imageUrl: m.image_url,
            caloriesTotal: m.calories_total,
            proteinGrams: m.protein_grams,
            carbsGrams: m.carbs_grams,
            fatsGrams: m.fats_grams,
          })))
        }
      } catch {
        // meal_recipes unavailable, will use fallback
      }
    })()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const fetchRecommendations = async (targetCals) => {
    setLoadingRecs(true)
    const meals = mealOptions || fallbackMeals

    const filtered = meals.filter(meal =>
      Math.abs((meal.caloriesTotal || 0) - targetCals) <= 200
    ).slice(0, 12)

    if (filtered.length === 0) {
      const sortedByDiff = [...meals].sort((a, b) =>
        Math.abs((a.caloriesTotal || 0) - targetCals) - Math.abs((b.caloriesTotal || 0) - targetCals)
      )
      setRecommendations(sortedByDiff.slice(0, 4))
    } else {
      setRecommendations(filtered)
    }

    setLoadingRecs(false)
  }

  const calculateMacros = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      try {
        const weight = parseFloat(formData.weight)
        const height = parseFloat(formData.height)
        const age = parseInt(formData.age, 10)

        if (!weight || weight <= 0 || !height || height <= 0 || !age || age <= 0) {
          throw new Error('Please enter valid positive numbers for weight, height, and age.')
        }

        // Conversions
        const weightKg = formData.weightUnit === 'lbs' ? weight / 2.20462 : weight
        const weightLbs = formData.weightUnit === 'kg' ? weight * 2.20462 : weight
        const heightCm = formData.heightUnit === 'in' ? height * 2.54 : height

        // BMR Calculation (Mifflin-St Jeor)
        let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
        bmr += formData.gender === 'male' ? 5 : -161

        // TDEE
        const tdee = bmr * ACTIVITY_MULTIPLIERS[formData.activity]

        // Target Calories
        let targetCalories = tdee + GOAL_ADJUSTMENTS[formData.goal]

        // Safety floor
        if (formData.gender === 'male' && targetCalories < 1500) targetCalories = 1500
        if (formData.gender === 'female' && targetCalories < 1200) targetCalories = 1200

        // Macros
        const proteinPerLb = formData.goal === 'maintenance' ? 1.0 : 1.2
        const proteinGrams = Math.round(weightLbs * proteinPerLb)
        const proteinCals = proteinGrams * 4

        const fatsPerLb = 0.35
        const fatsGrams = Math.round(weightLbs * fatsPerLb)
        const fatsCals = fatsGrams * 9

        let remainingCals = targetCalories - proteinCals - fatsCals
        if (remainingCals < 0) remainingCals = 0

        const carbsGrams = Math.round(remainingCals / 4)
        const carbsCals = carbsGrams * 4

        const finalCalories = proteinCals + fatsCals + carbsCals

        setResults({
          tdee: Math.round(tdee),
          calories: Math.round(finalCalories),
          protein: proteinGrams,
          fats: fatsGrams,
          carbs: carbsGrams,
          chartData: [
            { name: 'Protein', value: proteinCals, grams: proteinGrams, color: 'hsl(var(--primary))' },
            { name: 'Carbs', value: carbsCals, grams: carbsGrams, color: 'hsl(var(--accent))' },
            { name: 'Fats', value: fatsCals, grams: fatsGrams, color: 'hsl(var(--destructive))' }
          ]
        })

        // Fetch food recommendations based on calculated calories
        fetchRecommendations(Math.round(finalCalories))

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 600)
  }

  const resetForm = () => {
    setFormData({
      weight: '', weightUnit: 'lbs',
      height: '', heightUnit: 'in',
      age: '', gender: 'male',
      activity: 'moderate', goal: 'fat_loss'
    })
    setResults(null)
    setRecommendations([])
    setError('')
  }

  const handleGeneratePlan = () => {
    if (results) {
      router.push('/meal-plan')
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
          <p className="font-bold text-foreground mb-1">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.grams}g ({data.value} kcal)</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-32 pb-24">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
              <Calculator size={16} />
              Advanced Nutrition
            </div>
            <h1 className="heading-display mb-6">TDEE & Macro Calculator</h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              Discover exactly how many calories you burn daily and get a scientifically-backed macronutrient breakdown tailored to your specific goals.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Input Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 xl:col-span-4"
            >
              <Card className="border-border shadow-soft bg-card">
                <CardHeader className="pb-6 border-b border-border/50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Activity className="text-primary" size={24} />
                    Your Metrics
                  </CardTitle>
                  <CardDescription>
                    Enter your details for an accurate calculation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={calculateMacros} className="space-y-6">

                    {error && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Age</Label>
                        <Input
                          id="age" name="age" type="number" min="1" max="120"
                          value={formData.age} onChange={handleInputChange} required
                          placeholder="e.g. 30" className="h-12 bg-background text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Gender</Label>
                        <Select value={formData.gender} onValueChange={(val) => handleSelectChange('gender', val)}>
                          <SelectTrigger className="h-12 bg-background text-foreground">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="weight" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Weight</Label>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <button type="button" onClick={() => handleSelectChange('weightUnit', 'lbs')} className={`px-2 py-1 rounded ${formData.weightUnit === 'lbs' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>lbs</button>
                          <button type="button" onClick={() => handleSelectChange('weightUnit', 'kg')} className={`px-2 py-1 rounded ${formData.weightUnit === 'kg' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>kg</button>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          id="weight" name="weight" type="number" step="0.1" min="1"
                          value={formData.weight} onChange={handleInputChange} required
                          placeholder={formData.weightUnit === 'lbs' ? 'e.g. 180' : 'e.g. 80'}
                          className="h-12 bg-background pr-12 text-foreground placeholder:text-muted-foreground"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{formData.weightUnit}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="height" className="text-xs font-bold uppercase tracking-wider text-foreground/80">Height</Label>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <button type="button" onClick={() => handleSelectChange('heightUnit', 'in')} className={`px-2 py-1 rounded ${formData.heightUnit === 'in' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>in</button>
                          <button type="button" onClick={() => handleSelectChange('heightUnit', 'cm')} className={`px-2 py-1 rounded ${formData.heightUnit === 'cm' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>cm</button>
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          id="height" name="height" type="number" step="0.1" min="1"
                          value={formData.height} onChange={handleInputChange} required
                          placeholder={formData.heightUnit === 'in' ? "e.g. 70 (for 5'10\")" : 'e.g. 178'}
                          className="h-12 bg-background pr-12 text-foreground placeholder:text-muted-foreground"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{formData.heightUnit}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Activity Level</Label>
                      <Select value={formData.activity} onValueChange={(val) => handleSelectChange('activity', val)}>
                        <SelectTrigger className="h-12 bg-background text-foreground">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (Office job, little exercise)</SelectItem>
                          <SelectItem value="light">Lightly Active (1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderately Active (3-5 days/week)</SelectItem>
                          <SelectItem value="very">Very Active (6-7 days/week)</SelectItem>
                          <SelectItem value="extra">Extremely Active (Athlete/Physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Primary Goal</Label>
                      <Select value={formData.goal} onValueChange={(val) => handleSelectChange('goal', val)}>
                        <SelectTrigger className="h-12 bg-background text-foreground">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fat_loss">Fat Loss (-500 kcal)</SelectItem>
                          <SelectItem value="maintenance">Maintenance (Maintain weight)</SelectItem>
                          <SelectItem value="muscle_gain">Muscle Gain (+500 kcal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button
                        type="submit" disabled={loading}
                        className="flex-1 h-12 text-base font-bold tracking-wide rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                      >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Calculate'}
                      </Button>
                      <Button
                        type="button" variant="outline" onClick={resetForm} disabled={loading}
                        className="h-12 px-4 rounded-xl border-border text-foreground hover:bg-muted"
                        aria-label="Reset form"
                      >
                        <RefreshCw size={20} />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-7 xl:col-span-8 h-full"
            >
              {results ? (
                <div className="space-y-6 flex flex-col h-full">
                  {/* Top Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-secondary text-secondary-foreground border-none shadow-sm relative overflow-hidden">
                      <CardContent className="p-8">
                        <p className="text-sm font-bold uppercase tracking-widest text-secondary-foreground/60 mb-2">Daily Calories Burned (TDEE)</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-extrabold tracking-tight tabular-nums">{results.tdee}</span>
                          <span className="text-lg font-medium text-secondary-foreground/80">kcal</span>
                        </div>
                        <p className="text-sm text-secondary-foreground/60 mt-4">
                          The total energy you burn in a day.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground border-none shadow-md relative overflow-hidden">
                      <CardContent className="p-8">
                        <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground/80 mb-2 flex items-center gap-2">
                          <Target size={16} /> Daily Calorie Target
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-extrabold tracking-tight tabular-nums">{results.calories}</span>
                          <span className="text-lg font-medium text-primary-foreground/80">kcal</span>
                        </div>
                        <p className="text-sm text-primary-foreground/80 mt-4">
                          Your adjusted intake to achieve your goal.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Macro Breakdown */}
                  <Card className="border-border shadow-soft bg-card flex-grow">
                    <CardHeader className="pb-2 border-b border-border/50">
                      <CardTitle className="text-xl">Macronutrient Breakdown</CardTitle>
                      <CardDescription>Optimal daily targets to fuel your body.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">

                        {/* Chart */}
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={results.chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                paddingAngle={5} dataKey="value" stroke="none"
                              >
                                {results.chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Macro Cards */}
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="font-bold text-foreground">Protein</span>
                              </div>
                              <span className="text-sm text-muted-foreground">Muscle repair</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-2xl font-extrabold text-foreground tabular-nums">{results.protein}g</span>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full bg-accent"></div>
                                <span className="font-bold text-foreground">Carbs</span>
                              </div>
                              <span className="text-sm text-muted-foreground">Energy source</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-2xl font-extrabold text-foreground tabular-nums">{results.carbs}g</span>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-border bg-background flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-3 h-3 rounded-full bg-[hsl(var(--destructive))]"></div>
                                <span className="font-bold text-foreground">Fats</span>
                              </div>
                              <span className="text-sm text-muted-foreground">Hormone health</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-2xl font-extrabold text-foreground tabular-nums">{results.fats}g</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA for Meal Plan Generation */}
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                          className="pt-6 border-t border-border/60"
                        >
                          <Button
                            onClick={handleGeneratePlan}
                            className="w-full h-14 text-lg font-bold tracking-wide rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            Generate Optimized Meal Plan <ArrowRight size={20} />
                          </Button>
                        </motion.div>
                      </AnimatePresence>

                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-dashed border-2 border-border bg-muted/30 h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 rounded-2xl">
                  <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Calculator className="text-muted-foreground/50" size={40} />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Awaiting Your Metrics</h3>
                  <p className="text-muted-foreground max-w-md text-lg">
                    Fill out the form to generate your personalized targets and unlock the meal plan generator.
                  </p>
                </Card>
              )}
            </motion.div>

          </div>

          {/* Food Recommendations Section */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-24"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Recommended Foods for Your Goals</h2>
                  <p className="text-muted-foreground mt-1">Meals tailored to fit within ±200 calories of your {results.calories} kcal target.</p>
                </div>
              </div>

              {loadingRecs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="overflow-hidden border-border bg-card">
                      <Skeleton className="w-full aspect-[4/3] rounded-none" />
                      <CardContent className="p-5">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <div className="grid grid-cols-3 gap-2">
                          <Skeleton className="h-12 w-full rounded-lg" />
                          <Skeleton className="h-12 w-full rounded-lg" />
                          <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendations.map((meal) => (
                    <FoodRecommendationCard key={meal.id} meal={meal} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-dashed border-2 border-border bg-muted/30 rounded-2xl">
                  <Utensils className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No exact matches found</h3>
                  <p className="text-muted-foreground">Try adjusting your goals or activity level to see different recommendations.</p>
                </Card>
              )}
            </motion.div>
          )}

        </div>
      </main>
    </div>
  )
}

export default MacroCalculator
