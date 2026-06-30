import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MealImage from './MealImage.jsx';

const EthiopianFastingDishCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image;

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
      </CardHeader>
      
      <CardContent className="flex-grow pb-5">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {meal?.description || 'Traditional plant-based Ethiopian dish.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default EthiopianFastingDishCard;