import { useState, useCallback } from 'react';
import { getMealRecipes, getEthiopianMeals } from '@/db';

export const useMealPlanGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);

  const fallbackMeals = {
    breakfast: [
      { id: 'b1', name: 'Oatmeal & Berries', protein_grams: 15, carbs_grams: 45, fats_grams: 8, calories_total: 312 },
      { id: 'b2', name: 'Protein Pancakes', protein_grams: 30, carbs_grams: 35, fats_grams: 10, calories_total: 350 },
      { id: 'b3', name: 'Tofu Scramble', protein_grams: 22, carbs_grams: 15, fats_grams: 14, calories_total: 274 },
    ],
    lunch: [
      { id: 'l1', name: 'Quinoa & Lentil Bowl', protein_grams: 18, carbs_grams: 55, fats_grams: 12, calories_total: 400 },
      { id: 'l2', name: 'Chicken & Sweet Potato', protein_grams: 35, carbs_grams: 40, fats_grams: 8, calories_total: 372 },
      { id: 'l3', name: 'Shiro Wot & Injera', protein_grams: 15, carbs_grams: 60, fats_grams: 10, calories_total: 390 },
    ],
    dinner: [
      { id: 'd1', name: 'Grilled Salmon & Asparagus', protein_grams: 32, carbs_grams: 12, fats_grams: 22, calories_total: 374 },
      { id: 'd2', name: 'Misir Wot & Greens', protein_grams: 18, carbs_grams: 45, fats_grams: 8, calories_total: 324 },
      { id: 'd3', name: 'Lean Beef Tibs', protein_grams: 38, carbs_grams: 10, fats_grams: 18, calories_total: 354 },
    ]
  };

  const getImagesByPref = (pref) => {
    if (pref === 'ethiopian-fasting') return 'https://images.unsplash.com/photo-1550139161-f70dfb3ac3ce?auto=format&fit=crop&q=80&w=600';
    if (pref === 'global') return 'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&q=80&w=600';
    return 'https://images.unsplash.com/photo-1680211977755-ca9665d40d51?auto=format&fit=crop&q=80&w=600';
  };

  const generatePlan = useCallback(async (macros, durationWeeks, preference) => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedRecipes = [];
      try {
        if (preference === 'ethiopian-fasting' || preference === 'ethiopian-non-fasting') {
          fetchedRecipes = await getEthiopianMeals();
        } else {
          fetchedRecipes = await getMealRecipes();
        }
      } catch (dbError) {
        console.warn("Database fetch failed, falling back to built-in recipes.", dbError);
      }

      const recipes = { breakfast: [], lunch: [], dinner: [] };
      if (fetchedRecipes && fetchedRecipes.length > 5) {
        fetchedRecipes.forEach(r => {
          const cat = r.category || r.category;
          if (cat === 'breakfast') recipes.breakfast.push(r);
          else if (cat === 'lunch') recipes.lunch.push(r);
          else if (cat === 'dinner') recipes.dinner.push(r);
        });
      } else {
        recipes.breakfast = fallbackMeals.breakfast;
        recipes.lunch = fallbackMeals.lunch;
        recipes.dinner = fallbackMeals.dinner;
      }

      const totalDays = durationWeeks * 7;
      const targetCals = macros.calories;
      
      const splits = [
        { type: 'Breakfast', ratio: 0.25, options: recipes.breakfast },
        { type: 'Lunch', ratio: 0.40, options: recipes.lunch },
        { type: 'Dinner', ratio: 0.35, options: recipes.dinner }
      ];

      const generatedPlan = [];
      const imgUrl = getImagesByPref(preference);

      for (let w = 1; w <= durationWeeks; w++) {
        const weekDays = [];
        for (let d = 1; d <= 7; d++) {
          const dailyMeals = splits.map(split => {
            const optionIndex = (w * 7 + d + split.type.length) % split.options.length;
            const baseRecipe = split.options[optionIndex];
            
            const mealTargetCals = targetCals * split.ratio;
            const baseCals = baseRecipe.calories_total || 350;
            const scale = Math.max(0.5, Math.min(2.5, mealTargetCals / baseCals));
            
            return {
              id: `${w}-${d}-${split.type}`,
              type: split.type,
              name: baseRecipe.name,
              portion: scale > 1.2 ? 'Large Portion' : scale < 0.8 ? 'Small Portion' : 'Standard Portion',
              image: imgUrl,
              nutrition: {
                calories: Math.round((baseRecipe.calories_total || 350) * scale),
                protein: Math.round((baseRecipe.protein_grams || 20) * scale),
                carbs: Math.round((baseRecipe.carbs_grams || 30) * scale),
                fats: Math.round((baseRecipe.fats_grams || 10) * scale)
              }
            };
          });

          const dailyTotals = dailyMeals.reduce((acc, meal) => {
            acc.calories += meal.nutrition.calories;
            acc.protein += meal.nutrition.protein;
            acc.carbs += meal.nutrition.carbs;
            acc.fats += meal.nutrition.fats;
            return acc;
          }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

          weekDays.push({ dayNumber: d, meals: dailyMeals, totals: dailyTotals });
        }
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
            fats: Math.round(weekTotals.fats / 7),
          },
        });
      }

      await new Promise(res => setTimeout(res, 800));
      setMealPlan(generatedPlan);

    } catch (err) {
      console.error(err);
      setError('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { generatePlan, loading, error, mealPlan, setMealPlan };
};
