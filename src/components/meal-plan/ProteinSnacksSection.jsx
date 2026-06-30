import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, AlertCircle, RefreshCcw } from 'lucide-react';
import MealImage from './MealImage.jsx';
import { getHighProteinMeals } from '@/db';

const FALLBACK_SNACKS = [
  { id: 'fb-s1', name: 'Greek Yogurt (Plain)', description: 'Creamy plain Greek yogurt rich in protein and probiotics.', protein_grams: 15, calories_total: 150, ingredients: ['Plain Greek yogurt (1 cup)'], instructions: 'Scoop 1 cup of plain Greek yogurt into a bowl. Enjoy as-is or with a pinch of cinnamon.' },
  { id: 'fb-s2', name: 'Protein Bars (Chocolate/Vanilla)', description: 'Convenient whey protein bars with balanced macros for on-the-go nutrition.', protein_grams: 20, calories_total: 220 },
  { id: 'fb-s3', name: 'Mixed Yogurt Bowl with Berries', description: 'Greek yogurt topped with fresh mixed berries and a drizzle of honey.', protein_grams: 18, calories_total: 250 },
  { id: 'fb-s4', name: 'Beef Jerky', description: 'Lean, high-protein dried beef with smoky seasoning.', protein_grams: 12, calories_total: 90, ingredients: ['Beef jerky (2 oz)'], instructions: 'Open package and enjoy as a quick high-protein snack between meals.' },
  { id: 'fb-s5', name: 'Cottage Cheese & Pineapple', description: 'Low-fat cottage cheese with fresh pineapple chunks.', protein_grams: 22, calories_total: 180 },
  { id: 'fb-s6', name: 'Hard-Boiled Eggs (2)', description: 'Two hard-boiled eggs with a pinch of sea salt and black pepper.', protein_grams: 12, calories_total: 140 },
  { id: 'fb-s7', name: 'Edamame (Steamed)', description: 'Steamed edamame pods lightly salted — a plant-based protein snack.', protein_grams: 17, calories_total: 190 },
  { id: 'fb-s8', name: 'Roasted Chickpeas', description: 'Crispy oven-roasted chickpeas seasoned with smoked paprika.', protein_grams: 10, calories_total: 130 },
];

const ProteinSnacksSection = () => {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSnacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const records = await getHighProteinMeals({ category: 'snack', limit: 10 });
      setSnacks((records || []).length > 0 ? records : FALLBACK_SNACKS);
    } catch (err) {
      console.error('Error fetching snacks:', err);
      setSnacks(FALLBACK_SNACKS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnacks();
  }, [fetchSnacks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="overflow-hidden border border-border rounded-xl bg-card">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-5">
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (snacks.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs mb-4">
          <Zap className="w-4 h-4 text-primary" /> On-the-Go Fuel
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">High-Performance Snacks</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Maintain your macro targets between primary meals. These selections offer the perfect balance of convenience and precise caloric control.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {snacks.map((snack, index) => (
          <motion.div
            key={snack.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full"
          >
            <Card className="h-full border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                <MealImage src={snack?.imageUrl || snack?.image_url || snack?.image} name={snack.name} alt={snack.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="bg-background/95 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm inline-flex items-center tabular-nums">
                    {snack.calories_total || snack.calories || 0} <span className="text-muted-foreground text-xs font-medium ml-1">kcal</span>
                  </div>
                  {snack.protein_grams && (
                    <div className="text-primary-foreground bg-primary px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm tabular-nums">
                      {snack.protein_grams}g Pro
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-5 flex-grow flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {snack.name}
                </h3>
                {snack.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {snack.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {error && (
        <div className="mt-8 flex justify-center">
          <Button onClick={fetchSnacks} variant="outline" className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" /> Retry Loading
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProteinSnacksSection;