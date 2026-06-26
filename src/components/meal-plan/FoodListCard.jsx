import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Beef, Wheat, Droplets, Leaf, AlertCircle } from 'lucide-react';

const IMAGE_MAP = {
  'Doro Wot': 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/104d3afc679fac0dfc834200dfb0818c.png',
  'Kitfo': 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/ca0a0e38f41f6e86682c4fa70cb6e4b4.png',
  'Tibs': 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/9cf53ff3b3513ab6de2744c830fcd203.png',
  'Doro Tibs': 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/51e8e0fc94feb6cb0c1daf189b374090.png',
  'Greek Yogurt': 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/6bb01ef1eb4fd954c7bc71f7d8928952.png',
  'Greek Yogurt (Plain)': 'https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/6bb01ef1eb4fd954c7bc71f7d8928952.png'
};

const FoodListCard = ({ food, type }) => {
  if (!food) return null;

  const imgSrc = IMAGE_MAP[food?.name] || food?.imageUrl;

  // Determine badge styling based on category or region
  let badgeColor = "bg-muted text-muted-foreground";
  let displayCategory = food?.category || food?.region || "Meal";

  if (type === 'ethiopian') {
    if (food?.category === 'fasting') {
      badgeColor = "bg-[hsl(var(--food-fasting))/15] text-[hsl(var(--food-fasting))] border-[hsl(var(--food-fasting))/30]";
      displayCategory = "Fasting (Vegan)";
    } else {
      badgeColor = "bg-[hsl(var(--food-nonfasting))/15] text-[hsl(var(--food-nonfasting))] border-[hsl(var(--food-nonfasting))/30]";
      displayCategory = "Non-Fasting (Meat/Dairy)";
    }
  } else if (type === 'global') {
    badgeColor = "bg-[hsl(var(--food-global))/15] text-[hsl(var(--food-global))] border-[hsl(var(--food-global))/30]";
  }

  // Safely extract nutritional properties, checking both flat and nested structures
  const calories = food?.nutritionalInfo?.calories ?? food?.calories;
  const protein = food?.nutritionalInfo?.protein ?? food?.protein;
  const carbs = food?.nutritionalInfo?.carbs ?? food?.carbs;
  const fats = food?.nutritionalInfo?.fats ?? food?.fats;
  const fiber = food?.nutritionalInfo?.fiber ?? food?.fiber ?? 0;
  const servingSize = food?.servingSize ?? "";

  // Check if critical nutritional data is missing
  const isNutritionMissing = calories === undefined || protein === undefined;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60 bg-card rounded-2xl overflow-hidden group">
      
      {/* Image Section */}
      {imgSrc && (
        <div className="relative w-full h-40 overflow-hidden bg-muted shrink-0">
          <img 
            src={imgSrc} 
            alt={food?.name || 'Food Preview'} 
            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="px-6 pt-6 pb-2 flex justify-between items-start gap-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {food?.name || "Unknown Meal"}
        </h3>
        <Badge variant="outline" className={`whitespace-nowrap shrink-0 font-bold shadow-sm backdrop-blur-sm ${badgeColor}`}>
          {displayCategory}
        </Badge>
      </div>

      <CardContent className="px-6 pb-6 flex flex-col flex-grow">

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
          {food?.description || "No description available."}
        </p>

        {/* Nutritional Grid or Fallback */}
        <div className="mt-auto">
          {servingSize && (
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Serving Size: {servingSize}
            </p>
          )}
          
          {isNutritionMissing ? (
            <div className="bg-muted/40 rounded-xl p-4 border border-border/50 flex items-center justify-center gap-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Nutritional info unavailable</span>
            </div>
          ) : (
            <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
              <div className="grid grid-cols-5 gap-2">
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg border border-border/50">
                  <Flame className="w-4 h-4 text-orange-500 mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Cals</span>
                  <span className="text-sm font-black tabular-nums">{calories ?? 0}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg border border-border/50">
                  <Beef className="w-4 h-4 text-rose-500 mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Pro</span>
                  <span className="text-sm font-black tabular-nums">{protein ?? 0}g</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg border border-border/50">
                  <Wheat className="w-4 h-4 text-amber-500 mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Carb</span>
                  <span className="text-sm font-black tabular-nums">{carbs ?? 0}g</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg border border-border/50">
                  <Droplets className="w-4 h-4 text-yellow-500 mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Fat</span>
                  <span className="text-sm font-black tabular-nums">{fats ?? 0}g</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded-lg border border-border/50">
                  <Leaf className="w-4 h-4 text-emerald-500 mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Fiber</span>
                  <span className="text-sm font-black tabular-nums">{fiber}g</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ingredients */}
        {food?.ingredients && Array.isArray(food.ingredients) && food.ingredients.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Key Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {food.ingredients.map((ingredient, idx) => (
                <span key={idx} className="text-xs bg-muted text-foreground px-2 py-1 rounded-md font-medium">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default FoodListCard;