import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

const FoodRecommendationCard = ({ meal }) => {
  // Solin-style image rendering pattern: robust absolute positioning inside aspect-ratio container
  const imageUrl = meal?.imageUrl || 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/104d3afc679fac0dfc834200dfb0818c.png';

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={meal?.name || 'Meal Preview'} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-primary" /> {meal?.caloriesTotal || 0} kcal
          </span>
        </div>
      </div>

      <CardHeader className="pb-2 pt-5">
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {meal?.name || 'Unknown Meal'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow pb-5">
        <div className="grid grid-cols-3 gap-2 text-center mt-3">
          <div className="bg-muted/50 rounded-lg p-2 border border-border/50">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Protein</span>
            <span className="block font-extrabold text-foreground">{meal?.proteinGrams || 0}g</span>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 border border-border/50">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Carbs</span>
            <span className="block font-extrabold text-foreground">{meal?.carbsGrams || 0}g</span>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 border border-border/50">
            <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Fats</span>
            <span className="block font-extrabold text-foreground">{meal?.fatsGrams || 0}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodRecommendationCard;