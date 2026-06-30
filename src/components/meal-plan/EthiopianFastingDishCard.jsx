import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame } from 'lucide-react';
import MealImage from './MealImage.jsx';
import RecipeDetails from './RecipeDetails.jsx';

const EthiopianFastingDishCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image;
  const prepTime = meal?.prepTimeMinutes ?? meal?.prep_time_minutes ?? 0;
  const calories = meal?.caloriesTotal ?? meal?.calories_total ?? 0;
  const protein = meal?.proteinGrams ?? meal?.protein_grams ?? 0;

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
          {meal?.name || 'Unknown Dish'}
        </CardTitle>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2 font-medium flex-wrap">
          <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
            <Clock className="w-4 h-4"/> {prepTime}m prep
          </span>
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md">
            <Flame className="w-4 h-4"/> {calories} kcal
          </span>
          {protein > 0 && (
            <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-md font-semibold">
              {protein}g Protein
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-5">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {meal?.description || 'Traditional plant-based Ethiopian dish.'}
        </p>
        <RecipeDetails ingredients={meal?.ingredients} instructions={meal?.meal_prep_instructions} />
      </CardContent>
    </Card>
  );
};

export default EthiopianFastingDishCard;