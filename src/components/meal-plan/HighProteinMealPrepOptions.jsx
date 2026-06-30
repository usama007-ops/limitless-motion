import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dumbbell, AlertCircle, RefreshCcw } from 'lucide-react';
import { getHighProteinMeals } from '@/db';
import HighProteinMealCard from './HighProteinMealCard.jsx';

const FALLBACK_MEALS = [
  { id: 'fb-hp1', name: 'Grilled Chicken Breast', description: 'Juicy grilled chicken breast seasoned with herbs, served with steamed broccoli.', protein_grams: 48, calories_total: 320, category: 'dinner', ingredients: ['Chicken breast (8 oz)', 'Broccoli florets', 'Olive oil', 'Garlic powder', 'Paprika', 'Lemon juice'], instructions: '1. Season chicken breast with olive oil, garlic powder, paprika, salt, and pepper.\n2. Grill over medium-high heat for 6-7 minutes per side.\n3. Steam broccoli for 4-5 minutes until tender.\n4. Let chicken rest 5 minutes, slice, and serve with broccoli and a squeeze of lemon.' },
  { id: 'fb-hp2', name: 'Whey Protein Shake', description: 'Quick post-workout shake with whey protein isolate, banana, and almond milk.', protein_grams: 35, calories_total: 210, category: 'snack' },
  { id: 'fb-hp3', name: 'Lean Ground Turkey Bowl', description: 'Seasoned lean turkey with brown rice, black beans, and fresh salsa.', protein_grams: 42, calories_total: 480, category: 'lunch', ingredients: ['Lean ground turkey (6 oz)', 'Cooked brown rice', 'Black beans', 'Fresh salsa', 'Avocado', 'Lime', 'Cilantro'], instructions: '1. Cook brown rice according to package directions.\n2. Brown ground turkey in a skillet over medium heat, breaking apart with a spatula. Season with cumin, chili powder, salt, and pepper.\n3. Warm black beans in a small saucepan.\n4. Assemble bowl: rice, turkey, beans, salsa, sliced avocado. Garnish with cilantro and lime.' },
  { id: 'fb-hp4', name: 'Egg White Omelette', description: 'Fluffy egg white omelette with spinach, mushrooms, and low-fat cheese.', protein_grams: 32, calories_total: 260, category: 'breakfast' },
  { id: 'fb-hp5', name: 'Tuna Salad Wrap', description: 'Canned tuna mixed with Greek yogurt, celery, and onion in a whole wheat wrap.', protein_grams: 38, calories_total: 350, category: 'lunch' },
  { id: 'fb-hp6', name: 'Cottage Cheese Bowl', description: 'Low-fat cottage cheese with pineapple chunks and a sprinkle of chia seeds.', protein_grams: 28, calories_total: 220, category: 'snack' },
  { id: 'fb-hp7', name: 'Beef & Quinoa Stuffed Peppers', description: 'Bell peppers stuffed with lean ground beef, quinoa, and tomato sauce.', protein_grams: 40, calories_total: 440, category: 'dinner' },
  { id: 'fb-hp8', name: 'Greek Yogurt Chicken Salad', description: 'Shredded chicken mixed with Greek yogurt, grapes, and almonds over greens.', protein_grams: 36, calories_total: 370, category: 'lunch' },
];

const HighProteinMealPrepOptions = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getHighProteinMeals();
      setMeals((records || []).length > 0 ? records : FALLBACK_MEALS);
    } catch (err) {
      console.error('Error fetching high protein meals:', err);
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
          <Dumbbell className="w-8 h-8 text-primary" />
          High Protein Options
        </h2>
        <p className="text-muted-foreground text-lg">Maximum muscle recovery with high-protein recipes.</p>
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
            <HighProteinMealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HighProteinMealPrepOptions;
