import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, CheckCircle2, ArrowRight } from 'lucide-react';

const FastingBreakfastHero = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-lg mb-12 flex flex-col md:flex-row">
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center z-10">
        <Badge className="w-fit mb-6 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-3 py-1 text-sm">
          <Flame className="w-4 h-4 mr-1.5" /> Signature Fasting Meal
        </Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
          Protein Oat Pancakes
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          The ultimate plant-based breakfast to fuel your gym mornings. Packed with complex carbs and plant protein to keep you full and energized.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {['High Protein (25g)', 'High Fiber (8g)', 'Keeps You Full', 'Perfect for Gym Mornings'].map((highlight, i) => (
            <div key={i} className="flex items-center text-sm font-medium text-foreground">
              <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0" />
              {highlight}
            </div>
          ))}
        </div>

        <div className="mb-8 p-5 bg-muted/50 rounded-2xl border border-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">Key Ingredients</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">Blended oats, banana, peanut butter, almond milk, optional plant protein.</p>
        </div>

        <Button className="w-fit group h-12 px-6 rounded-xl">
          View Full Recipe <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      <div className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-muted">
        <img 
          src="https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/1eb2b43ab398565466327d709ddcbd8d.png" 
          alt="Protein Oat Pancakes" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card via-card/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default FastingBreakfastHero;