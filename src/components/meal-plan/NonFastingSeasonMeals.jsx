import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Globe, AlertCircle, RefreshCcw } from 'lucide-react';
import { getMealRecipes } from '@/db';
import MealCard from './MealCard.jsx';

const FALLBACK_MEALS = [
  { id: 'fb-m1', name: 'Grilled Chicken Salad', description: 'Fresh greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette.', calories_total: 420, protein_grams: 45, carbs_grams: 18, fats_grams: 22, prep_time_minutes: 20, category: 'lunch', ingredients: ['Grilled chicken breast', 'Mixed salad greens', 'Cherry tomatoes', 'Cucumber', 'Balsamic vinaigrette', 'Parmesan shavings'], instructions: '1. Grill chicken breast for 6-7 minutes per side until internal temp reaches 165°F. Let rest 5 minutes then slice.\n2. Toss mixed greens, halved cherry tomatoes, and sliced cucumber in a large bowl.\n3. Drizzle with balsamic vinaigrette and toss to coat.\n4. Top with sliced chicken and parmesan shavings. Serve immediately.' },
  { id: 'fb-m2', name: 'Overnight Oats with Berries', description: 'Rolled oats soaked in almond milk topped with mixed berries and a drizzle of honey.', calories_total: 350, protein_grams: 12, carbs_grams: 55, fats_grams: 8, prep_time_minutes: 10, category: 'breakfast' },
  { id: 'fb-m3', name: 'Salmon with Roasted Vegetables', description: 'Pan-seared salmon fillet served with a medley of roasted seasonal vegetables.', calories_total: 520, protein_grams: 40, carbs_grams: 25, fats_grams: 28, prep_time_minutes: 35, category: 'dinner', ingredients: ['Salmon fillet (6 oz)', 'Asparagus spears', 'Bell peppers', 'Zucchini', 'Olive oil', 'Lemon', 'Garlic', 'Dill'], instructions: '1. Preheat oven to 400°F. Toss chopped vegetables with olive oil, salt, and pepper.\n2. Spread vegetables on a baking sheet and roast for 15 minutes.\n3. Season salmon with salt, pepper, and dill. Place on the same sheet with vegetables.\n4. Roast for another 12-15 minutes until salmon flakes easily. Squeeze lemon on top.' },
  { id: 'fb-m4', name: 'Turkey & Avocado Wrap', description: 'Whole wheat wrap filled with sliced turkey, fresh avocado, lettuce, and light mayo.', calories_total: 380, protein_grams: 35, carbs_grams: 30, fats_grams: 14, prep_time_minutes: 10, category: 'lunch' },
  { id: 'fb-m5', name: 'Veggie Stir-Fry with Tofu', description: 'Crisp vegetables and tofu stir-fried in a light soy sauce with ginger and garlic.', calories_total: 310, protein_grams: 20, carbs_grams: 28, fats_grams: 14, prep_time_minutes: 25, category: 'dinner' },
  { id: 'fb-m6', name: 'Greek Yogurt Parfait', description: 'Layers of Greek yogurt, granola, and fresh seasonal fruits.', calories_total: 280, protein_grams: 18, carbs_grams: 40, fats_grams: 6, prep_time_minutes: 5, category: 'breakfast' },
  { id: 'fb-m7', name: 'Lean Beef Stir-Fry', description: 'Thinly sliced lean beef with broccoli, bell peppers, and a savory stir-fry sauce.', calories_total: 450, protein_grams: 42, carbs_grams: 20, fats_grams: 22, prep_time_minutes: 25, category: 'dinner' },
  { id: 'fb-m8', name: 'Protein Smoothie Bowl', description: 'Blended banana, whey protein, spinach, and almond milk topped with seeds and sliced fruits.', calories_total: 340, protein_grams: 35, carbs_grams: 38, fats_grams: 7, prep_time_minutes: 10, category: 'breakfast' },
];

const NonFastingSeasonMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getMealRecipes();
      const filtered = (records || []).filter(r =>
        !r.season || r.season === 'non-fasting' || r.season === 'both'
      );
      setMeals(filtered.length > 0 ? filtered : FALLBACK_MEALS);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setMeals(FALLBACK_MEALS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
          <Globe className="w-8 h-8 text-primary" />
          Global Meal Collection
        </h2>
        <p className="text-muted-foreground text-lg">A curated selection of everyday nutritious meals from around the world.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="overflow-hidden border border-border rounded-xl bg-card">
              <Skeleton className="w-full h-48 rounded-none" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
          <Button onClick={fetchMeals} variant="outline" className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {meals.map(meal => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NonFastingSeasonMeals;
