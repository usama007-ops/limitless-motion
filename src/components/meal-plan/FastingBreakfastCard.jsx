import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame } from 'lucide-react';

const FastingBreakfastCard = ({ meal }) => {
  const imageUrl = meal?.imageUrl || meal?.image_url || meal?.image || 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/6bb01ef1eb4fd954c7bc71f7d8928952.png';
  const prepTime = meal?.prepTimeMinutes ?? meal?.prep_time_minutes ?? 0;
  const calories = meal?.caloriesTotal ?? meal?.calories_total ?? 0;

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={meal?.name || 'Breakfast Preview'} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {meal?.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {meal?.name || 'Unknown Breakfast'}
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
          {meal?.description || 'A nutritious fasting breakfast option.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default FastingBreakfastCard;