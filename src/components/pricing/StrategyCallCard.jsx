import React from 'react';
import { PhoneCall, Target, Compass, Zap } from 'lucide-react';

const StrategyCallCard = () => {
  return (
    <div className="bg-muted/50 border border-border rounded-3xl p-8 md:p-10">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center shadow-sm border border-border relative">
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[spin_10s_linear_infinite]"></div>
            <PhoneCall size={48} className="text-primary" />
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="inline-block px-3 py-1 bg-background border border-border rounded-full text-xs font-bold tracking-wider uppercase text-muted-foreground mb-4">
            Complimentary
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">15-Minute Strategy Call</h3>
          <p className="text-muted-foreground text-lg mb-6">
            Not sure where to start? Let's discuss your goals, current challenges, and vision to determine the best coaching approach for your unique journey.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="text-primary" size={18} /> Define Goals
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Compass className="text-primary" size={18} /> Map Direction
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Zap className="text-primary" size={18} /> Action Plan
            </div>
          </div>
          
          <button 
            onClick={() => {
              document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-secondary-modern"
          >
            Schedule Free Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyCallCard;