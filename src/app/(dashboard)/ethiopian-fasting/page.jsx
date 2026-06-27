'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import TeffInjEraEducation from '@/components/meal-plan/TeffInjEraEducation';
import EthiopianFastingDishCard from '@/components/meal-plan/EthiopianFastingDishCard';
import { Button } from '@/components/ui/button';
import { getEthiopianMeals } from '@/db';

const fallbackDishes = [
  {
    name: "Misir Wot",
    description: "A deeply flavorful, slow-cooked spicy red lentil stew featuring aromatic berbere spice.",
    ingredients: ["Red lentils (1 cup)", "Berbere (2 tbsp)", "Onions (1 cup)", "Garlic (3 cloves)", "Ginger (1 tsp)"],
    nutritionFacts: { calories: 210, protein: 7.5, carbs: 35, fiber: 6.8, fat: 1.2, iron: 3.2, calcium: 45 },
    healthBenefits: ["Supports cardiovascular health", "Provides sustained energy release", "Promotes muscle recovery"],
    prepTime: "30 mins",
    servingSize: "1 cup / serving",
    whyGoodForFasting: "Plant-based and incredibly nutrient-dense. The high protein and complex carbs ensure sustained energy without animal products."
  },
  {
    name: "Shiro",
    description: "A smooth, creamy stew made from roasted and ground chickpea flour, simmered with minced onions and garlic.",
    ingredients: ["Chickpea flour (1/2 cup)", "Berbere (1 tbsp)", "Onions (1/2 cup)", "Garlic (2 cloves)", "Oil (1 tbsp)"],
    nutritionFacts: { calories: 185, protein: 8.2, carbs: 28, fiber: 5.1, fat: 2.8, iron: 2.1, calcium: 52 },
    healthBenefits: ["Boosts digestive health", "Excellent plant protein source", "Supports stable blood sugar"],
    prepTime: "20 mins",
    servingSize: "1 cup / serving",
    whyGoodForFasting: "An essential fasting staple that digests easily while providing a robust profile of amino acids essential during animal product restriction."
  },
  {
    name: "Gomen",
    description: "Tender collard greens slow-cooked with a mild blend of garlic, ginger, and diced onions.",
    ingredients: ["Collard greens (2 cups)", "Garlic (2 cloves)", "Onions (1/2 cup)", "Ginger (1 tsp)", "Jalapeño (1/2)"],
    nutritionFacts: { calories: 95, protein: 4.1, carbs: 16, fiber: 3.2, fat: 0.8, iron: 1.8, calcium: 180 },
    healthBenefits: ["Exceptional bone health support", "Potent antioxidant properties", "Aids natural detoxification"],
    prepTime: "25 mins",
    servingSize: "1 cup / serving",
    whyGoodForFasting: "Crucial for micronutrient intake. Provides high volumes of calcium and iron to compensate for dairy and meat absence."
  }
];

function mapEthiopianMealToDish(m) {
  const ingredients = Array.isArray(m.ingredients) ? m.ingredients : ['No ingredient data'];
  const cal = Number(m.calories_total) || 0;
  return {
    name: m.name,
    description: m.description || '',
    ingredients: ingredients.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
    nutritionFacts: {
      calories: cal,
      protein: Number(m.protein_grams) || 0,
      carbs: Number(m.carbs_grams) || 0,
      fiber: 0,
      fat: Number(m.fats_grams) || 0,
      iron: 0,
      calcium: 0,
    },
    healthBenefits: ["Nutrient-dense traditional dish", "Supports overall wellness", "Rich in plant-based nutrition"],
    prepTime: m.prep_time_minutes ? `${m.prep_time_minutes} mins` : '30 mins',
    servingSize: '1 serving',
    whyGoodForFasting: 'A traditional Ethiopian dish packed with plant-based nutrients to sustain energy during fasting periods.'
  };
}

const EthiopianFastingPage = () => {
  const [dishes, setDishes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Ethiopian Fasting Foods | Limitless Motion';
    loadDishes();
  }, []);

  async function loadDishes() {
    try {
      const data = await getEthiopianMeals();
      if (data?.length) setDishes(data.map(mapEthiopianMealToDish));
    } catch (err) {
      console.error('Failed to load dishes from DB, using fallback:', err);
    } finally {
      setLoading(false);
    }
  }

  const displayDishes = dishes || fallbackDishes;

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        
        <Button variant="ghost" asChild className="mb-8 pl-0 hover:bg-transparent hover:text-accent transition-colors font-medium">
          <Link href="/fuel" className="flex items-center text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Fuel
          </Link>
        </Button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-none overflow-hidden bg-primary text-primary-foreground mb-20 shadow-elevation-2"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          <div className="relative z-10 p-10 md:p-20 max-w-4xl border border-accent/20 m-2">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest mb-8">
              <Leaf className="w-3.5 h-3.5" /> Plant-Based Mastery
            </div>
            <h1 className="heading-display font-serif mb-8 text-primary-foreground">
              Ethiopian Fasting Foods <br/>
              <span className="text-accent italic font-light">Nutritional Excellence</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-primary-foreground/80 leading-relaxed">
              Discover the ancient wisdom of Ethiopian Orthodox fasting traditions. A masterclass in vegan, plant-based nutrition that perfectly aligns with modern athletic performance and mindful recovery.
            </p>
          </div>
        </motion.div>

        <TeffInjEraEducation />

        <div className="w-full h-px bg-border my-20"></div>

        <div className="mb-16">
          <div className="max-w-3xl mb-12">
            <h2 className="heading-section font-serif mb-6 text-primary">The Fasting Arsenal</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore these foundational dishes. Packed with plant-based protein, complex carbohydrates, and essential micronutrients, they form the bedrock of a performance-optimized fasting diet.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayDishes.map((dish, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.1, 0.3) }}
                >
                  <EthiopianFastingDishCard meal={dish} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EthiopianFastingPage;
