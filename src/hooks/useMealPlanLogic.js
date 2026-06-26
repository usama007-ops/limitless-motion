import { useState, useCallback } from 'react';
import { ethiopianFasting, ethiopianNonFasting, globalHighProtein } from '@/data/FoodListsData.js';

export const useMealPlanLogic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePlan = useCallback(async (macros, durationWeeks, category) => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Validate inputs
      if (!macros || !macros.calories || !macros.protein || !macros.carbs || !macros.fats) {
        throw new Error('Please provide complete macro targets to generate a plan.');
      }

      // 2. Select meal pool based on category
      let mealPool = [];
      if (category === 'ethiopian-fasting') {
        mealPool = ethiopianFasting;
      } else if (category === 'ethiopian-non-fasting') {
        mealPool = ethiopianNonFasting;
      } else {
        mealPool = globalHighProtein;
      }

      const totalDays = durationWeeks * 7;
      const targetCals = macros.calories;
      
      // Target distributions (rough estimates per meal to guide scaling)
      const splits = [
        { type: 'Breakfast', ratio: 0.25 },
        { type: 'Lunch', ratio: 0.40 },
        { type: 'Dinner', ratio: 0.35 }
      ];

      const generatedPlan = [];
      
      for (let w = 1; w <= durationWeeks; w++) {
        const weekDays = [];
        
        for (let d = 1; d <= 7; d++) {
          let dailyCals = 0;
          let dailyPro = 0;
          let dailyCarb = 0;
          let dailyFat = 0;

          const dailyMeals = splits.map((split, index) => {
            // Select a random meal from the pool
            // Ensure some variety by offsetting based on day/week
            const mealIndex = (w * 7 + d + index * 3) % mealPool.length;
            const baseMeal = mealPool[mealIndex];
            
            // Calculate a scaling factor to hit the macro target for this meal
            const targetMealCals = targetCals * split.ratio;
            const scale = Math.max(0.5, Math.min(2.5, targetMealCals / (baseMeal.calories || 300)));
            
            const scaledMeal = {
              id: `${w}-${d}-${split.type}`,
              type: split.type,
              name: baseMeal.name,
              category: baseMeal.category,
              description: baseMeal.description,
              prepTime: baseMeal.prepTime,
              image: baseMeal.imageUrl || 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&q=80&w=600', // Authentic-looking generic fallback
              nutrition: {
                calories: Math.round(baseMeal.calories * scale),
                protein: Math.round(baseMeal.protein * scale),
                carbs: Math.round(baseMeal.carbs * scale),
                fats: Math.round(baseMeal.fats * scale)
              }
            };
            
            dailyCals += scaledMeal.nutrition.calories;
            dailyPro += scaledMeal.nutrition.protein;
            dailyCarb += scaledMeal.nutrition.carbs;
            dailyFat += scaledMeal.nutrition.fats;
            
            return scaledMeal;
          });

          weekDays.push({ 
            dayNumber: d, 
            meals: dailyMeals, 
            totals: {
              calories: dailyCals,
              protein: dailyPro,
              carbs: dailyCarb,
              fats: dailyFat
            }
          });
        }
        
        // Calculate weekly averages
        const weekTotals = weekDays.reduce((acc, day) => {
          acc.calories += day.totals.calories;
          acc.protein += day.totals.protein;
          acc.carbs += day.totals.carbs;
          acc.fats += day.totals.fats;
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        generatedPlan.push({ 
          weekNumber: w, 
          days: weekDays,
          weeklyAverages: {
            calories: Math.round(weekTotals.calories / 7),
            protein: Math.round(weekTotals.protein / 7),
            carbs: Math.round(weekTotals.carbs / 7),
            fats: Math.round(weekTotals.fats / 7)
          }
        });
      }

      // Simulate network request for smooth UX
      await new Promise(res => setTimeout(res, 1200));
      return generatedPlan;

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate meal plan. Please check your inputs.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generatePlan, loading, error };
};