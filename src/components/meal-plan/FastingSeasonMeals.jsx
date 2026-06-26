import React from 'react';
import { useMealPlanLogic } from '@/hooks/useMealPlanLogic';
import { Clock, Flame, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const FastingSeasonMeals = () => {
  const { mealDatabase, isAvailable, getConflictingMealTime, addFood } = useMealPlanLogic();
  const fastingMeals = mealDatabase.filter(m => m.season === 'fasting');

  const handleAdd = (time, meal) => {
    if (!isAvailable(meal.name)) {
      const conflict = getConflictingMealTime(meal.name);
      toast.error(`This food is already in your meal plan for ${conflict}. Remove it from there first or choose a different option.`);
      return;
    }
    addFood(time, meal);
    toast.success(`Added ${meal.name} to ${time}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Fasting Season Options</h2>
        <p className="text-muted-foreground">100% plant-based traditional Ethiopian meals perfect for fasting periods.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fastingMeals.map(meal => {
          const available = isAvailable(meal.name);
          const conflictTime = !available ? getConflictingMealTime(meal.name) : null;

          return (
            <div 
              key={meal.id} 
              className={cn(
                "card-modern flex flex-col h-full transition-all",
                !available && "opacity-60 grayscale-[0.5]"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                  {meal.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Clock size={14} /> {meal.prepTime + (meal.cookTime || 0)}m
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-foreground">{meal.name}</h3>
              
              <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                <div className="bg-muted p-2 rounded-lg"><p className="text-[10px] text-muted-foreground uppercase">Cal</p><p className="font-bold text-sm">{meal.macros?.calories || meal.caloriesTotal || 0}</p></div>
                <div className="bg-muted p-2 rounded-lg"><p className="text-[10px] text-muted-foreground uppercase">Pro</p><p className="font-bold text-sm">{meal.macros?.protein || meal.proteinGrams || 0}g</p></div>
                <div className="bg-muted p-2 rounded-lg"><p className="text-[10px] text-muted-foreground uppercase">Carb</p><p className="font-bold text-sm">{meal.macros?.carbs || meal.carbsGrams || 0}g</p></div>
                <div className="bg-muted p-2 rounded-lg"><p className="text-[10px] text-muted-foreground uppercase">Fat</p><p className="font-bold text-sm">{meal.macros?.fats || meal.fatsGrams || 0}g</p></div>
              </div>

              <div className="mb-4 flex-grow">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><Flame size={16} className="text-primary"/> Ingredients</h4>
                <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                  {Array.isArray(meal.ingredients) ? meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>) : null}
                </ul>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4" title={meal.instructions || meal.mealPrepInstructions}>
                  {meal.instructions || meal.mealPrepInstructions}
                </p>
                
                <div className="flex justify-end">
                  {available ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="default" size="sm" className="w-full">
                          <Plus className="w-4 h-4 mr-2" /> Add to Plan
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAdd('breakfast', meal)}>Breakfast</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAdd('lunch', meal)}>Lunch</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAdd('dinner', meal)}>Dinner</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAdd('snack', meal)}>Snack</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full">
                            <Button disabled variant="outline" size="sm" className="w-full opacity-50 cursor-not-allowed">
                              <Check className="w-4 h-4 mr-2" /> Selected
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Already selected for {conflictTime}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FastingSeasonMeals;