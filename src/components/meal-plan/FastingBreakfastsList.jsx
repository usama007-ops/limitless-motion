import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Coffee, AlertCircle, RefreshCcw } from 'lucide-react';
import { getFastingBreakfasts } from '@/db';
import FastingBreakfastCard from './FastingBreakfastCard.jsx';

const FastingBreakfastsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getFastingBreakfasts();
      setMeals(records || []);
    } catch (err) {
      console.error('Error fetching fasting breakfasts:', err);
      setError('Failed to load fasting breakfasts. Please try again.');
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
      ) : meals.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border flex flex-col items-center">
          <Coffee className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">No fasting breakfasts available at the moment.</p>
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
