import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Loader2, Target, Info, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getMealRecipes, getEthiopianMeals, getHighProteinMeals, getFastingBreakfasts } from '@/db';
import { ethiopianFasting, ethiopianNonFasting, globalHighProtein } from '@/data/FoodListsData.js';

function normalize(recipe) {
  return {
    name: recipe.name,
    calories: recipe.calories ?? recipe.calories_total ?? 0,
  };
}

const PreviewGrid = ({ items, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl aspect-square bg-secondary/30 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {items.slice(0, 4).map((item, idx) => (
        <div key={idx} className="group relative rounded-xl overflow-hidden aspect-square border border-border bg-secondary/50 flex flex-col justify-end p-4 hover:bg-secondary transition-colors duration-300">
          <p className="text-secondary-foreground text-sm font-bold leading-tight line-clamp-2">{item.name}</p>
          <p className="text-secondary-foreground/80 text-[10px] font-medium uppercase tracking-wider mt-2">{item.calories} kcal</p>
        </div>
      ))}
    </div>
  );
};

const MealPlanGenerator = ({ initialMacros, onGenerate, loading, error }) => {
  const [duration, setDuration] = useState(4);
  const [category, setCategory] = useState('global');
  const [macros, setMacros] = useState(initialMacros || { calories: 2200, protein: 160, carbs: 200, fats: 65 });

  const [previews, setPreviews] = useState({
    global: globalHighProtein.map(normalize),
    'ethiopian-fasting': ethiopianFasting.map(normalize),
    'ethiopian-non-fasting': ethiopianNonFasting.map(normalize),
  });
  const [previewsLoading, setPreviewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPreviewsLoading(true);
      try {
        const [mr, hp, eth, fb] = await Promise.all([
          getMealRecipes(),
          getHighProteinMeals(),
          getEthiopianMeals(),
          getFastingBreakfasts(),
        ]);

        if (cancelled) return;

        const nonFastingRecipe = (mr || []).filter(r =>
          !r.season || r.season === 'non-fasting' || r.season === 'both'
        );

        setPreviews({
          global: [...nonFastingRecipe, ...(hp || [])].map(normalize),
          'ethiopian-fasting': [...(eth || []), ...(fb || [])].map(normalize),
          'ethiopian-non-fasting': [...(eth || []), ...(hp || [])].map(normalize),
        });
      } catch {
        // keep hardcoded fallbacks
      } finally {
        if (!cancelled) setPreviewsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleMacroChange = (e) => {
    const { name, value } = e.target;
    setMacros(prev => ({ ...prev, [name]: parseInt(value) || '' }));
  };

  const handleSubmit = () => {
    onGenerate(macros, duration, category);
  };

  return (
    <Card className="bg-card border-border shadow-elevation-2 rounded-3xl overflow-hidden max-w-5xl mx-auto">
      <div className="bg-foreground text-background p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Build Your Blueprint</h2>
          <p className="text-background/70 font-medium">Precision nutrition structured for your goals.</p>
        </div>
        <div className="flex bg-background/10 rounded-xl p-1">
          <Button 
            variant={duration === 4 ? 'default' : 'ghost'} 
            onClick={() => setDuration(4)}
            className={`rounded-lg h-10 px-6 font-bold ${duration === 4 ? 'bg-background text-foreground shadow-sm hover:bg-background' : 'text-background hover:text-background hover:bg-background/20'}`}
          >
            4 Weeks
          </Button>
          <Button 
            variant={duration === 6 ? 'default' : 'ghost'} 
            onClick={() => setDuration(6)}
            className={`rounded-lg h-10 px-6 font-bold ${duration === 6 ? 'bg-background text-foreground shadow-sm hover:bg-background' : 'text-background hover:text-background hover:bg-background/20'}`}
          >
            6 Weeks
          </Button>
        </div>
      </div>

      <CardContent className="p-8 md:p-10 space-y-10">
        
        {/* Macro Inputs Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold tracking-tight uppercase">Your Macro Targets</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Calories</Label>
              <Input name="calories" type="number" value={macros.calories} onChange={handleMacroChange} className="h-12 font-bold tabular-nums text-lg text-foreground bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Protein (g)</Label>
              <Input name="protein" type="number" value={macros.protein} onChange={handleMacroChange} className="h-12 font-bold tabular-nums text-lg text-foreground bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Carbs (g)</Label>
              <Input name="carbs" type="number" value={macros.carbs} onChange={handleMacroChange} className="h-12 font-bold tabular-nums text-lg text-foreground bg-background" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fats (g)</Label>
              <Input name="fats" type="number" value={macros.fats} onChange={handleMacroChange} className="h-12 font-bold tabular-nums text-lg text-foreground bg-background" />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div>
          <h3 className="text-lg font-bold tracking-tight uppercase mb-4">Dietary Preference</h3>
          <Tabs value={category} onValueChange={setCategory} className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 h-auto p-1.5 bg-muted rounded-xl gap-1">
              <TabsTrigger value="global" className="py-3 rounded-lg font-bold data-[state=active]:shadow-sm text-sm">
                Global (High-Protein)
              </TabsTrigger>
              <TabsTrigger value="ethiopian-fasting" className="py-3 rounded-lg font-bold data-[state=active]:shadow-sm text-sm">
                Ethiopian Fasting (Vegan)
              </TabsTrigger>
              <TabsTrigger value="ethiopian-non-fasting" className="py-3 rounded-lg font-bold data-[state=active]:shadow-sm text-sm">
                Ethiopian Non-Fasting
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="global" className="mt-6 focus-visible:outline-none">
              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <p className="text-sm font-medium text-foreground leading-relaxed flex items-start gap-2">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  Fitness-optimized international cuisine. Focused on ultra-lean proteins, complex carbohydrates, and functional macro distributions for maximum physical performance.
                </p>
                <PreviewGrid items={previews.global} loading={previewsLoading} />
              </div>
            </TabsContent>
            
            <TabsContent value="ethiopian-fasting" className="mt-6 focus-visible:outline-none">
              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <p className="text-sm font-medium text-foreground leading-relaxed flex items-start gap-2">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  100% plant-based Ethiopian cuisine complying with Orthodox fasting rules. Rich in fiber, legumes, and nutrient-dense Teff to support sustained energy and gut health.
                </p>
                <PreviewGrid items={previews['ethiopian-fasting']} loading={previewsLoading} />
              </div>
            </TabsContent>
            
            <TabsContent value="ethiopian-non-fasting" className="mt-6 focus-visible:outline-none">
              <div className="bg-secondary/40 p-6 rounded-2xl border border-border">
                <p className="text-sm font-medium text-foreground leading-relaxed flex items-start gap-2">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  Traditional Ethiopian dishes including meats and dairy. Features robust stews, lean beef preparations (like Kitfo), and high-protein chicken dishes.
                </p>
                <PreviewGrid items={previews['ethiopian-non-fasting']} loading={previewsLoading} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-bold border border-destructive/20">
            {error}
          </div>
        )}

        <Button 
          onClick={handleSubmit}
          disabled={loading || !macros.calories}
          className="w-full h-16 text-xl font-extrabold tracking-wide rounded-xl shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1 transition-all"
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Engineering Your Plan...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wand2 className="w-6 h-6" /> Generate Plan
            </span>
          )}
        </Button>

      </CardContent>
    </Card>
  );
};

export default MealPlanGenerator;