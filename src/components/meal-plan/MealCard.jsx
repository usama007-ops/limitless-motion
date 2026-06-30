import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame } from 'lucide-react';
import MealImage from './MealImage.jsx';
import RecipeDetails from './RecipeDetails.jsx';

const MealCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image;
  const prepTime = meal?.prepTimeMinutes ?? meal?.prep_time_minutes ?? 0;
  const calories = meal?.caloriesTotal ?? meal?.calories_total ?? meal?.nutrition?.calories ?? 0;
  const protein = meal?.proteinGrams ?? meal?.protein_grams ?? meal?.nutrition?.protein ?? 0;
  const carbs = meal?.carbsGrams ?? meal?.carbs_grams ?? meal?.nutrition?.carbs ?? 0;
  const fats = meal?.fatsGrams ?? meal?.fats_grams ?? meal?.nutrition?.fats ?? 0;

  const hasMacros = protein > 0 || carbs > 0 || fats > 0;

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
        <MealImage src={imageUrl} name={meal?.name} alt={meal?.name} />
        {meal?.category && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="shadow-sm capitalize backdrop-blur-sm bg-background/80">
              {meal.category}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {meal?.name || 'Unknown Meal'}
        </CardTitle>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2 font-medium">
          <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
            <Clock className="w-4 h-4"/> {prepTime}m prep
          </span>
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md">
            <Flame className="w-4 h-4"/> {calories} kcal
          </span>
        </div>
        {hasMacros && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-md font-semibold">
              P {protein}g
            </span>
            <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2.5 py-0.5 rounded-md font-semibold">
              C {carbs}g
            </span>
            <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-md font-semibold">
              F {fats}g
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow pb-5">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {meal?.description || 'A nutritious and balanced meal option.'}
        </p>
        <RecipeDetails ingredients={meal?.ingredients} instructions={meal?.instructions} />
      </CardContent>
    </Card>
  );
};

export default MealCard;