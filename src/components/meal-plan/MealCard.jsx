import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame } from 'lucide-react';

const MealCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image;
  const prepTime = meal?.prepTimeMinutes ?? meal?.prep_time_minutes ?? 0;
  const calories = meal?.caloriesTotal ?? meal?.calories_total ?? 0;
  
  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={meal?.name || 'Meal Preview'} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
            <span className="text-sm font-medium">No image</span>
          </div>
        )}
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
      </CardHeader>
      
      <CardContent className="flex-grow pb-5">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {meal?.description || 'A nutritious and balanced meal option.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default MealCard;