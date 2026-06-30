import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, AlertCircle, RefreshCcw } from 'lucide-react';
import { getEthiopianMeals } from '@/db';
import EthiopianFastingDishCard from './EthiopianFastingDishCard.jsx';

const FALLBACK_MEALS = [
  { id: 'fb-e1', name: 'Doro Wat', description: 'Spicy Ethiopian chicken stew simmered with berbere spice blend and hard-boiled eggs.', category: 'dinner', ingredients: ['Chicken (legs and thighs)', 'Berbere spice blend', 'Onions', 'Garlic', 'Ginger', 'Tomato paste', 'Hard-boiled eggs', 'Niter kibbeh (spiced butter)'], instructions: '1. Finely chop onions and sauté in niter kibbeh over medium heat until deeply browned (15-20 minutes).\n2. Add garlic, ginger, and berbere. Cook 2-3 minutes until fragrant.\n3. Stir in tomato paste and cook another 2 minutes.\n4. Add chicken pieces and enough water to cover. Simmer 30-40 minutes until chicken is tender.\n5. Add peeled hard-boiled eggs and simmer 10 more minutes. Serve with injera.' },
  { id: 'fb-e2', name: 'Misir Wat', description: 'Red lentil stew cooked with onions, garlic, and traditional Ethiopian spices.', category: 'dinner' },
  { id: 'fb-e3', name: 'Tibs', description: 'Sautéed beef or lamb with onions, peppers, and traditional herbs served with injera.', category: 'dinner', ingredients: ['Beef sirloin or lamb', 'Red onions', 'Bell peppers', 'Jalapeño', 'Rosemary', 'Niter kibbeh', 'Berbere spice'], instructions: '1. Cut meat into bite-sized cubes and season with salt and berbere.\n2. Heat niter kibbeh in a pan over high heat. Sear meat until browned on all sides (3-4 minutes).\n3. Add sliced onions and bell peppers. Sauté 3-4 minutes until slightly softened.\n4. Add fresh rosemary and jalapeño slices. Cook 1 minute more.\n5. Serve immediately over injera with a side of awaze sauce.' },
  { id: 'fb-e4', name: 'Shiro', description: 'Smooth chickpea or broad bean stew seasoned with garlic and berbere.', category: 'dinner' },
  { id: 'fb-e5', name: 'Gomen', description: 'Collard greens sautéed with onions, garlic, and ginger in spiced butter.', category: 'lunch' },
  { id: 'fb-e6', name: 'Firfir', description: 'Shredded injera stir-fried with berbere sauce and clarified butter.', category: 'breakfast' },
  { id: 'fb-e7', name: 'Kitfo', description: 'Ethiopian steak tartare seasoned with mitmita and spiced clarified butter.', category: 'dinner' },
  { id: 'fb-e8', name: 'Azifa', description: 'Cold lentil salad with lemon, jalapeño, and mustard — perfect as a side dish.', category: 'lunch' },
];

const EthiopianMealPrepOptions = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getEthiopianMeals();
      setMeals((records || []).length > 0 ? records : FALLBACK_MEALS);
    } catch (err) {
      console.error('Error fetching Ethiopian meals:', err);
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
          <UtensilsCrossed className="w-8 h-8 text-primary" />
          Traditional Ethiopian Dishes
        </h2>
        <p className="text-muted-foreground text-lg">Authentic, nutrient-rich recipes optimized for your health goals.</p>
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
            <EthiopianFastingDishCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EthiopianMealPrepOptions;
