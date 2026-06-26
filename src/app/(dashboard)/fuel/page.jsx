'use client'

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Droplets, Calculator, Apple, Flame, Globe, Leaf, Beef } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const globalMeals = [
  {
    name: "Grilled Chicken Breast with Roasted Vegetables",
    cal: 350,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/4b3a5ba244e9b2561c2aa280d088526c.png"
  },
  {
    name: "Salmon with Sweet Potato",
    cal: 420,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/60abc79e0550b5308ea7db3875ad88f3.png"
  },
  {
    name: "Lean Beef with Brown Rice",
    cal: 450,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/ca0a0e38f41f6e86682c4fa70cb6e4b4.png"
  },
  {
    name: "Egg White Omelet with Vegetables",
    cal: 200,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/4b3a5ba244e9b2561c2aa280d088526c.png"
  }
];

const fastingMeals = [
  {
    name: "Misir Wot",
    cal: 320,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/104d3afc679fac0dfc834200dfb0818c.png"
  },
  {
    name: "Shiro",
    cal: 280,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/51e8e0fc94feb6cb0c1daf189b374090.png"
  },
  {
    name: "Gomen",
    cal: 120,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/9cf53ff3b3513ab6de2744c830fcd203.png"
  },
  {
    name: "Kik Alicha",
    cal: 290,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/ca0a0e38f41f6e86682c4fa70cb6e4b4.png"
  }
];

const nonFastingMeals = [
  {
    name: "Doro Wot",
    cal: 450,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/104d3afc679fac0dfc834200dfb0818c.png"
  },
  {
    name: "Kitfo",
    cal: 420,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/ca0a0e38f41f6e86682c4fa70cb6e4b4.png"
  },
  {
    name: "Tibs",
    cal: 350,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/9cf53ff3b3513ab6de2744c830fcd203.png"
  },
  {
    name: "Doro Tibs",
    cal: 320,
    imageUrl: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/51e8e0fc94feb6cb0c1daf189b374090.png"
  }
];

const MealSection = ({ title, description, meals, icon: Icon, badgeColor }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
    className="pt-8 border-t border-border/50"
  >
    <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-end justify-between">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl text-white shadow-sm ${badgeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h2>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {meals.map((meal, idx) => (
        <Card key={idx} className="border-border/60 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer bg-card flex flex-col h-full hover:-translate-y-1 group">
          <div className="relative w-full aspect-[4/3] bg-muted shrink-0 overflow-hidden">
            {meal.imageUrl ? (
              <img
                src={meal.imageUrl}
                alt={meal.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">No image</span>
              </div>
            )}
          </div>
          <CardContent className="p-6 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg leading-snug line-clamp-3 text-foreground group-hover:text-primary transition-colors mb-4">
                {meal.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-border/40">
              <Flame className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold text-base text-foreground">{meal.cal}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">KAL</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </motion.section>
);

const FuelPage = () => {
  const router = useRouter();

  useEffect(() => {
    document.title = 'FUEL | Limitless Motion';
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-16 shadow-lg"
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-6 uppercase tracking-widest font-bold backdrop-blur-sm px-3 py-1.5">
              <Utensils className="w-4 h-4 mr-2 inline" /> Nutrition Protocol
            </Badge>
            <h1 className="heading-display mb-6">Fuel Your Fire.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-10 max-w-2xl leading-relaxed">
              Optimize your performance. Access workout-specific nutrition guidance and personalized macro targets curated for elite achievers.
            </p>
            <Button variant="secondary" size="lg" onClick={() => router.push('/calculator')} className="font-bold shadow-md hover:shadow-lg transition-all rounded-xl h-14 px-8 text-lg bg-background text-foreground hover:bg-background/90">
              <Calculator className="w-5 h-5 mr-3" /> Macro Calculator
            </Button>
          </div>
        </motion.div>

        <div>
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Training Nutrition</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">Tailored energy protocols to match your daily physical demands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border/60 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 rounded-2xl overflow-hidden group flex flex-col hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-xl">BURN Fuel</CardTitle>
                  <CardDescription className="font-medium">High-intensity requirements</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Focus on easily digestible carbohydrates 1-2 hours before your BURN sessions to maximize energy output and prevent premature fatigue.</p>
                <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Pre-Workout Staples</h4>
                  <ul className="space-y-3 text-sm font-semibold">
                    <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span> <span>Banana with almond butter</span></li>
                    <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span> <span>Oatmeal with berries</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/60 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 rounded-2xl overflow-hidden group flex flex-col hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Droplets className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-xl">MOVE Recovery</CardTitle>
                  <CardDescription className="font-medium">Rebuilding functional tissue</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Prioritize protein and hydration to repair muscle tissue and restore joint lubrication immediately following intense MOVE sessions.</p>
                <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Post-Workout Staples</h4>
                  <ul className="space-y-3 text-sm font-semibold">
                    <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span> <span>Protein shake with collagen</span></li>
                    <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span> <span>Grilled chicken and sweet potato</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/60 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 rounded-2xl overflow-hidden group flex flex-col hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="text-xl">ALIGN Balance</CardTitle>
                  <CardDescription className="font-medium">Steady energy release</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Maintain a balanced macro profile to support both strength gains and mindful recovery during your ALIGN rest and mobility days.</p>
                <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Maintenance Staples</h4>
                  <ul className="space-y-3 text-sm font-semibold">
                    <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> <span>Salmon with quinoa and asparagus</span></li>
                    <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span> <span>Greek yogurt with mixed nuts</span></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-16">
          <div className="text-center md:text-left mb-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Meal Databases</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">Curated recipes designed for ultimate athletic performance and longevity.</p>
          </div>

          <MealSection
            title="Global (High-Protein)"
            description="Fitness-optimized international cuisine. Focused on ultra-lean proteins, complex carbohydrates, and functional macro distributions for maximum physical performance."
            meals={globalMeals}
            icon={Globe}
            badgeColor="bg-blue-500"
          />

          <MealSection
            title="Ethiopian Fasting (Vegan)"
            description="100% plant-based Ethiopian cuisine complying with Orthodox fasting rules. Rich in fiber, legumes, and nutrient-dense Teff to support sustained energy and gut health."
            meals={fastingMeals}
            icon={Leaf}
            badgeColor="bg-emerald-500"
          />

          <MealSection
            title="Ethiopian Non-Fasting"
            description="Traditional Ethiopian dishes including meats and dairy. Features robust stews, lean beef preparations (like Kitfo), and high-protein chicken dishes."
            meals={nonFastingMeals}
            icon={Beef}
            badgeColor="bg-rose-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FuelPage;
