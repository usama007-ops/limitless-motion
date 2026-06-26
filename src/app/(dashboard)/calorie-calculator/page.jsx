'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Flame, Target, ArrowRight, Activity } from 'lucide-react';

const CalorieCalculator = () => {
  const [macros, setMacros] = useState({
    protein: '',
    carbs: '',
    fats: '',
    currentIntake: '',
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.title = 'Macro & Calorie Calculator - Limitless Motion';
  }, []);

  const handleChange = (e) => {
    setMacros({ ...macros, [e.target.name]: e.target.value });
  };

  const calculateCalories = (e) => {
    e.preventDefault();
    
    const p = parseFloat(macros.protein) || 0;
    const c = parseFloat(macros.carbs) || 0;
    const f = parseFloat(macros.fats) || 0;
    const intake = parseFloat(macros.currentIntake) || 0;

    const targetCalories = Math.round((p * 4) + (c * 4) + (f * 9));
    const difference = intake - targetCalories;

    setResult({
      target: targetCalories,
      difference: Math.abs(difference),
      isSurplus: difference > 0,
      isDeficit: difference < 0,
      isMaintenance: difference === 0,
      intake
    });
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Calculator size={16} />
            Nutrition Tools
          </div>
          <h1 className="heading-display mb-6">Macro & Calorie Calculator</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Determine your exact daily calorie target based on your macronutrient goals, and see how your current intake aligns with your plan.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <Card className="border-border shadow-soft bg-card">
              <CardHeader className="pb-6 border-b border-border/50">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="text-primary" size={24} />
                  Your Macro Goals
                </CardTitle>
                <CardDescription className="text-base">
                  Enter your target macronutrients in grams to calculate your total daily calories.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={calculateCalories} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="protein" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Protein (g)
                      </Label>
                      <div className="relative">
                        <Input
                          id="protein"
                          name="protein"
                          type="number"
                          min="0"
                          step="0.1"
                          value={macros.protein}
                          onChange={handleChange}
                          required
                          placeholder="150"
                          className="h-14 text-lg pl-4 pr-12 bg-background border-border focus-visible:ring-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">g</span>
                      </div>
                      <p className="text-xs text-muted-foreground">4 calories per gram</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="carbs" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Carbs (g)
                      </Label>
                      <div className="relative">
                        <Input
                          id="carbs"
                          name="carbs"
                          type="number"
                          min="0"
                          step="0.1"
                          value={macros.carbs}
                          onChange={handleChange}
                          required
                          placeholder="200"
                          className="h-14 text-lg pl-4 pr-12 bg-background border-border focus-visible:ring-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">g</span>
                      </div>
                      <p className="text-xs text-muted-foreground">4 calories per gram</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="fats" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Fats (g)
                      </Label>
                      <div className="relative">
                        <Input
                          id="fats"
                          name="fats"
                          type="number"
                          min="0"
                          step="0.1"
                          value={macros.fats}
                          onChange={handleChange}
                          required
                          placeholder="65"
                          className="h-14 text-lg pl-4 pr-12 bg-background border-border focus-visible:ring-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">g</span>
                      </div>
                      <p className="text-xs text-muted-foreground">9 calories per gram</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <div className="space-y-3 max-w-md">
                      <Label htmlFor="currentIntake" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Current / Planned Intake (kcal)
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentIntake"
                          name="currentIntake"
                          type="number"
                          min="0"
                          value={macros.currentIntake}
                          onChange={handleChange}
                          required
                          placeholder="2500"
                          className="h-14 text-lg pl-4 pr-16 bg-background border-border focus-visible:ring-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">kcal</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enter what you are currently eating to see your surplus or deficit.
                      </p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold tracking-wide rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                    Calculate Targets
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5"
          >
            {result ? (
              <Card className="border-primary/20 shadow-celadon bg-card h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-muted-foreground font-medium">Results</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center space-y-8 pt-4">
                  
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-2">Your daily calorie target is:</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-extrabold text-foreground tracking-tight">{result.target}</span>
                      <span className="text-xl font-medium text-muted-foreground">kcal</span>
                    </div>
                  </div>

                  <div className="h-px w-full bg-border"></div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-foreground/60 mb-4">Intake Analysis</p>
                    
                    <div className={`p-6 rounded-2xl border ${
                      result.isSurplus ? 'bg-warning/10 border-warning/20 text-warning-foreground' : 
                      result.isDeficit ? 'bg-primary/10 border-primary/20 text-primary-foreground' : 
                      'bg-muted border-border text-foreground'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 ${
                          result.isSurplus ? 'bg-warning/20 text-warning' : 
                          result.isDeficit ? 'bg-primary/20 text-primary' : 
                          'bg-background text-foreground'
                        }`}>
                          <Activity size={24} />
                        </div>
                        <div>
                          <h4 className={`text-xl font-bold mb-1 ${
                            result.isSurplus ? 'text-warning' : 
                            result.isDeficit ? 'text-primary' : 
                            'text-foreground'
                          }`}>
                            {result.isSurplus && 'Calorie Surplus'}
                            {result.isDeficit && 'Calorie Deficit'}
                            {result.isMaintenance && 'Maintenance'}
                          </h4>
                          <p className="text-foreground/80 font-medium text-lg">
                            {result.isSurplus && `You are in a +${result.difference} calorie surplus.`}
                            {result.isDeficit && `You are in a -${result.difference} calorie deficit.`}
                            {result.isMaintenance && `You are eating exactly at maintenance.`}
                          </p>
                          <p className="text-sm text-foreground/60 mt-2">
                            Based on your planned intake of {result.intake} kcal.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 border-border bg-muted/30 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Flame className="text-muted-foreground/50" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Awaiting Input</h3>
                <p className="text-muted-foreground max-w-xs">
                  Enter your macronutrient goals and current intake to see your personalized calorie analysis.
                </p>
              </Card>
            )}
          </motion.div>

        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-32 border-t border-border pt-20"
        >
          <div className="text-center mb-12">
            <h2 className="heading-section mb-4">Fuel Your Movement</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Now that you know your targets, discover nutrition plans tailored to your lifestyle and cultural preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link href="/ethiopian-fasting" className="group h-full">
              <Card className="h-full bg-card hover:border-primary/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">Ethiopian Fasting</h3>
                  <p className="text-muted-foreground mb-8 flex-grow">Traditional, plant-based, and rich in flavor. Perfect for fasting seasons.</p>
                  <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    View Recipes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/ethiopian-non-fasting" className="group h-full">
              <Card className="h-full bg-card hover:border-primary/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">Ethiopian Non-Fasting</h3>
                  <p className="text-muted-foreground mb-8 flex-grow">High-protein, flavor-rich traditional dishes for building strength.</p>
                  <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    View Recipes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/meal-plan" className="group h-full">
              <Card className="h-full bg-card hover:border-primary/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">Global Cuisine</h3>
                  <p className="text-muted-foreground mb-8 flex-grow">Balanced, macro-focused meals designed for optimal athletic performance.</p>
                  <span className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    View Recipes <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CalorieCalculator;
