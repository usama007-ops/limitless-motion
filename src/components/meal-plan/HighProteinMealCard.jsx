import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

const HighProteinMealCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image;
  const protein = meal?.proteinGrams ?? meal?.protein_grams ?? 0;
  const calories = meal?.caloriesTotal ?? meal?.calories_total ?? 0;

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={meal?.name || 'High Protein Meal'} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
            <span className="text-sm font-medium">No image</span>
          </div>
        )}
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