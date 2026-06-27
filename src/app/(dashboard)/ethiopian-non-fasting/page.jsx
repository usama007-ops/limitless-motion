'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getEthiopianMeals, getMealRecipesBySeason } from '@/db';

const fallbackRecipes = [
  {
    name: 'Doro Wot (Spiced Chicken Stew)',
    prepTime: '2 hrs',
    servings: 6,
    macros: { cal: 450, pro: '35g', carb: '15g', fat: '28g' },
    ingredients: ['1 whole chicken, cut into pieces', '4 large red onions, minced', '1/2 cup berbere', '1/4 cup niter kibbeh (spiced butter)', 'Hard-boiled eggs'],
    instructions: 'Slow-cook onions without oil until reduced. Add kibbeh and berbere, cook for 30 mins. Add chicken pieces and simmer until tender. Add hard-boiled eggs at the end.'
  },
  {
    name: 'Kitfo (Minced Beef)',
    prepTime: '15 mins',
    servings: 2,
    macros: { cal: 520, pro: '45g', carb: '2g', fat: '35g' },
    ingredients: ['1 lb lean beef, finely minced', '3 tbsp niter kibbeh, melted', '1 tbsp mitmita (spiced chili powder)', 'Pinch of cardamom'],
    instructions: 'In a bowl, mix the melted spiced butter with mitmita and cardamom. Gently fold in the minced beef. Serve raw (leb leb) or lightly warmed, accompanied by kocho.'
  },
  {
    name: 'Tibs (Sautéed Meat)',
    prepTime: '25 mins',
    servings: 4,
    macros: { cal: 380, pro: '32g', carb: '8g', fat: '22g' },
    ingredients: ['1 lb beef or lamb, cubed', '2 onions, sliced', '2 jalapeños, sliced', '2 tbsp niter kibbeh', 'Rosemary sprigs'],
    instructions: 'Sear meat in a hot pan until browned. Add onions and kibbeh, sauté until onions are soft. Toss in jalapeños and rosemary right before serving.'
  }
];

function mapToRecipe(item) {
  const cal = Number(item.calories_total) || 0;
  const pro = Number(item.protein_grams) || 0;
  const carb = Number(item.carbs_grams) || 0;
  const fat = Number(item.fats_grams) || 0;
  const ingredients = Array.isArray(item.ingredients) ? item.ingredients.map(i => `• ${i}`) : ['No ingredient data'];
  return {
    name: item.name,
    prepTime: item.prep_time_minutes ? `${item.prep_time_minutes} mins` : '30 mins',
    servings: 4,
    macros: { cal, pro: `${pro}g`, carb: `${carb}g`, fat: `${fat}g` },
    ingredients,
    instructions: item.meal_prep_instructions || item.instructions || 'No instructions available.',
  };
}

const EthiopianNonFasting = () => {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Ethiopian Non-Fasting Nutrition - Limitless Motion';
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const [ethiopianMeals, nonFastingRecipes] = await Promise.all([
        getEthiopianMeals(),
        getMealRecipesBySeason('non-fasting'),
      ]);
      const combined = [];
      if (ethiopianMeals?.length) combined.push(...ethiopianMeals.map(mapToRecipe));
      if (nonFastingRecipes?.length) combined.push(...nonFastingRecipes.map(mapToRecipe));
      if (combined.length) setRecipes(combined);
    } catch (err) {
      console.error('Failed to load recipes from DB, using fallback:', err);
    } finally {
      setLoading(false);
    }
  }

  const displayRecipes = recipes || fallbackRecipes;

  return (
    <div className="pt-40 pb-24">
      <div className="container-luxury">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h1 className="heading-display mb-6 text-foreground">Ethiopian Non-Fasting</h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-muted-foreground font-light">
            High-protein, flavor-rich traditional dishes designed to support muscle growth and recovery.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
            {displayRecipes.map((recipe, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border-t-4 border-primary shadow-xl p-8 flex flex-col rounded-none"
              >
                <h3 className="text-2xl font-serif mb-4 text-foreground">{recipe.name}</h3>
                <div className="flex gap-6 text-sm text-muted-foreground mb-8 pb-6 border-b border-border font-medium">
                  <span>⏱ {recipe.prepTime}</span>
                  <span>👥 {recipe.servings} servings</span>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mb-8 text-center">
                  <div className="bg-muted p-3 rounded"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Cal</p><p className="font-bold text-lg text-foreground">{recipe.macros.cal}</p></div>
                  <div className="bg-muted p-3 rounded"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pro</p><p className="font-bold text-lg text-foreground">{recipe.macros.pro}</p></div>
                  <div className="bg-muted p-3 rounded"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Carb</p><p className="font-bold text-lg text-foreground">{recipe.macros.carb}</p></div>
                  <div className="bg-muted p-3 rounded"><p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fat</p><p className="font-bold text-lg text-foreground">{recipe.macros.fat}</p></div>
                </div>

                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-widest text-foreground font-bold mb-4">Ingredients</h4>
                  <ul className="text-base text-muted-foreground space-y-2 font-light">
                    {recipe.ingredients.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary mt-1">•</span> {item.startsWith('•') ? item.slice(2) : item}</li>)}
                  </ul>
                </div>

                <div className="mt-auto">
                  <h4 className="text-sm uppercase tracking-widest text-foreground font-bold mb-4">Instructions</h4>
                  <p className="text-base text-muted-foreground font-light leading-relaxed">{recipe.instructions}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center bg-primary text-primary-foreground p-16 rounded-none shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,rgba(27,77,62,1)_100%)]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-serif mb-6">Want personalized meal plans?</h2>
            <p className="text-primary-foreground/80 font-light text-lg mb-10 max-w-2xl mx-auto">Sign up to access our full database of recipes, macro tracking, and personalized nutrition coaching.</p>
            <Link href="/signup">
              <button className="bg-accent text-accent-foreground px-10 py-5 text-lg font-medium tracking-widest uppercase hover:bg-white hover:text-foreground transition-all duration-300 shadow-xl">
                Unlock Full Access
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthiopianNonFasting;
