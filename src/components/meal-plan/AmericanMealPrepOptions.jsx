import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Clock, Flame, Utensils, Plus, Check } from 'lucide-react';
import { useMealPlanLogic } from '@/hooks/useMealPlanLogic';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AmericanMealPrepOptions = () => {
  const { americanMeals, selectedMeals, preventDuplicateSelection, addFood } = useMealPlanLogic();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeals = americanMeals.filter(meal => {
    const query = searchQuery.toLowerCase();
    const matchesName = meal.name?.toLowerCase().includes(query);
    const matchesIngredients = Array.isArray(meal.ingredients) 
      ? meal.ingredients.some(ing => ing.toLowerCase().includes(query))
      : false;
    return matchesName || matchesIngredients;
  });

  const handleAdd = (time, meal) => {
    const conflictTime = preventDuplicateSelection(meal, selectedMeals);
    if (conflictTime) {
      toast.error(`This meal is already selected for ${conflictTime}. Please choose a different option.`);
      return;
    }
    addFood(time, meal);
    toast.success(`Added ${meal.name} to ${time}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Utensils className="text-primary" />
            American & Global Dishes
          </h2>
          <p className="text-muted-foreground mt-1">High-protein, macro-friendly standard meals.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search dishes or ingredients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">No dishes found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMeals.map((meal) => {
            const conflictTime = preventDuplicateSelection(meal, selectedMeals);
            const available = !conflictTime;

            return (
              <Card 
                key={meal.id} 
                className={cn(
                  "overflow-hidden border-border transition-all shadow-sm flex flex-col",
                  available ? "hover:border-primary/30" : "opacity-60 grayscale-[0.5]"
                )}
              >
                <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-xl mb-1">{meal.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="shrink-0 capitalize">
                      {meal.category || 'Meal'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 text-sm font-medium">
                    <span className="flex items-center gap-1 text-primary">
                      <Flame className="w-4 h-4" /> {meal.macros.calories} kcal
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" /> {meal.prepTime + meal.cookTime} min total
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="bg-secondary/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Protein</p>
                      <p className="font-semibold text-secondary-foreground">{meal.macros.protein}g</p>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Carbs</p>
                      <p className="font-semibold text-secondary-foreground">{meal.macros.carbs}g</p>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Fats</p>
                      <p className="font-semibold text-secondary-foreground">{meal.macros.fats}g</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wider">Ingredients</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {Array.isArray(meal.ingredients) ? meal.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        )) : <li>No ingredients listed</li>}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wider">Instructions</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3" title={meal.instructions}>
                        {meal.instructions}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto border-t border-border/50 bg-muted/10 flex justify-end">
                  {available ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="default" size="sm" className="w-full sm:w-auto mt-4">
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
                          <div className="w-full sm:w-auto mt-4">
                            <Button disabled variant="outline" size="sm" className="w-full opacity-50 cursor-not-allowed">
                              <Check className="w-4 h-4 mr-2" /> Already Selected
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Already selected for {conflictTime}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AmericanMealPrepOptions;