'use client'

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChefHat, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import MealPlanGenerator from '@/components/meal-plan/MealPlanGenerator';
import MealPlanDisplay from '@/components/meal-plan/MealPlanDisplay';
import NonFastingSeasonMeals from '@/components/meal-plan/NonFastingSeasonMeals';
import HighProteinMealPrepOptions from '@/components/meal-plan/HighProteinMealPrepOptions';
import EthiopianMealPrepOptions from '@/components/meal-plan/EthiopianMealPrepOptions';
import FastingBreakfastsList from '@/components/meal-plan/FastingBreakfastsList';
import ProteinSnacksSection from '@/components/meal-plan/ProteinSnacksSection';
import { useMealPlanLogic } from '@/hooks/useMealPlanLogic';
import { toast } from 'sonner';

const MealPlanPage = () => {
  const router = useRouter();
  const planRef = useRef(null);
  
  const [macros] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { generatePlan, loading, error } = useMealPlanLogic();

  const handleGenerate = async (macroTargets, duration, category) => {
    try {
      const plan = await generatePlan(macroTargets, duration, category);
      setGeneratedPlan(plan);
      setSelectedCategory(category);
      toast.success("Meal plan successfully generated!");
      
      setTimeout(() => {
        planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      toast.error(err.message || "Failed to generate plan");
    }
  };

  return (
    <>
      <div className="pt-32 pb-24">
        <div className="container-luxury">
          
          <div className="mb-10">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/calculator')}
              className="pl-0 hover:bg-transparent hover:text-primary transition-colors text-muted-foreground font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calculator
            </Button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-6">
              <Zap className="w-4 h-4" /> Fuel Your Body
            </div>
            <h1 className="heading-display mb-6">Nutrition, Engineered.</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Translate your exact macro targets into actionable, delicious daily meals. Choose your preferred dietary style and let the algorithm do the heavy lifting.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MealPlanGenerator 
              initialMacros={macros}
              onGenerate={handleGenerate}
              loading={loading}
              error={error}
            />
          </motion.div>

          <AnimatePresence>
            {generatedPlan && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8"
              >
                <MealPlanDisplay 
                  ref={planRef} 
                  plan={generatedPlan} 
                  targetMacros={macros || { calories: 2200, protein: 160, carbs: 200, fats: 65 }} 
                  category={selectedCategory}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full h-px bg-border my-24"></div>

          <div className="space-y-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <NonFastingSeasonMeals />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <HighProteinMealPrepOptions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <EthiopianMealPrepOptions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <FastingBreakfastsList />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ProteinSnacksSection />
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
};

export default MealPlanPage;
