import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';
import MealImage from './MealImage.jsx';

const HighProteinMealCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image;
  const protein = meal?.proteinGrams ?? meal?.protein_grams ?? meal?.nutrition?.protein ?? 0;
  const calories = meal?.caloriesTotal ?? meal?.calories_total ?? meal?.nutrition?.calories ?? 0;

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
        <MealImage src={imageUrl} name={meal?.name} alt={meal?.name} />
      </div>
      <CardHeader className="pb-3 pt-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors flex-grow">
            {meal?.name || 'Unknown Meal'}
          </CardTitle>
          <Badge className="bg-primary text-primary-foreground shadow-sm shrink-0">
            {protein}g Protein
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-3 font-medium">
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md">
            <Flame className="w-4 h-4"/> {calories} kcal
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-6">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {meal?.description || 'A high protein meal to support your goals.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default HighProteinMealCard;