import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Coffee, AlertCircle, RefreshCcw } from 'lucide-react';
import { getFastingBreakfasts } from '@/db';
import FastingBreakfastCard from './FastingBreakfastCard.jsx';

const FALLBACK_MEALS = [
  { id: 'fb-fb1', name: 'Ethiopian Ful', description: 'Fava beans cooked with onions, tomatoes, and jalapeños served with crusty bread.', calories_total: 320, prep_time_minutes: 25, category: 'ethiopian', ingredients: ['Fava beans (canned or dried)', 'Onion', 'Tomatoes', 'Jalapeño', 'Garlic', 'Olive oil', 'Crusty bread or injera', 'Lemon juice'], instructions: '1. If using dried fava beans, soak overnight and boil until tender. If canned, rinse and drain.\n2. Sauté chopped onion, garlic, and jalapeño in olive oil until softened.\n3. Add diced tomatoes and cook until they break down (5 minutes).\n4. Add fava beans and mash roughly with a fork. Simmer 10 minutes, adding water as needed.\n5. Season with salt, pepper, and lemon juice. Serve warm with crusty bread or injera.' },
  { id: 'fb-fb2', name: 'Kitcha with Berbere', description: 'Whole wheat flatbread topped with berbere-spiced tomato sauce and fresh herbs.', calories_total: 280, prep_time_minutes: 20, category: 'ethiopian' },
  { id: 'fb-fb3', name: 'Smoothie Bowl', description: 'Blended banana, spinach, plant-based protein and almond milk topped with granola.', calories_total: 350, prep_time_minutes: 10, category: 'global', ingredients: ['Banana', 'Fresh spinach', 'Plant-based protein powder', 'Unsweetened almond milk', 'Granola', 'Chia seeds', 'Mixed berries'], instructions: '1. Blend banana, spinach, protein powder, and almond milk until smooth and creamy.\n2. Pour into a bowl.\n3. Top with granola, chia seeds, and fresh berries. Serve immediately.' },
  { id: 'fb-fb4', name: 'Avocado Rice Cakes', description: 'Brown rice cakes topped with smashed avocado, cherry tomatoes, and flaky sea salt.', calories_total: 260, prep_time_minutes: 10, category: 'global' },
  { id: 'fb-fb5', name: 'Scrambled Tofu with Greens', description: 'Turmeric scrambled tofu with sautéed kale, bell peppers, and nutritional yeast.', calories_total: 290, prep_time_minutes: 15, category: 'global' },
  { id: 'fb-fb6', name: 'Injera with Shiro', description: 'Sourdough flatbread served with smooth chickpea stew and a side of fresh greens.', calories_total: 380, prep_time_minutes: 30, category: 'ethiopian' },
  { id: 'fb-fb7', name: 'Chia Pudding', description: 'Chia seeds soaked in coconut milk with vanilla, topped with fresh mango chunks.', calories_total: 240, prep_time_minutes: 5, category: 'global' },
  { id: 'fb-fb8', name: 'Fasting Protein Oats', description: 'Oatmeal made with water, plant protein, cinnamon, and sliced bananas.', calories_total: 310, prep_time_minutes: 15, category: 'global' },
];

const FastingBreakfastsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getFastingBreakfasts();
      setMeals((records || []).length > 0 ? records : FALLBACK_MEALS);
    } catch (err) {
      console.error('Error fetching fasting breakfasts:', err);
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
          <Coffee className="w-8 h-8 text-primary" />
          Fasting Breakfasts
        </h2>
        <p className="text-muted-foreground text-lg">Nutrient-dense morning meals optimized for fasting periods.</p>
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
            <FastingBreakfastCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FastingBreakfastsList;
