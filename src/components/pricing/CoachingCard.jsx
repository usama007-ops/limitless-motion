import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const CoachingCard = ({ duration, price, title, description, features, isPopular }) => {
  return (
    <div className={`relative flex flex-col h-full bg-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isPopular ? 'border-2 border-primary shadow-lg' : 'border border-border shadow-sm'}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
          Most Popular
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Clock size={18} />
            <span>{duration} Session</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-foreground">${price}</span>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8 flex-grow">
        {description}
      </p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => {
          document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
        }}
        className={`w-full py-3 rounded-xl font-semibold tracking-wide transition-all flex items-center justify-center gap-2 ${
          isPopular 
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-celadon' 
            : 'bg-muted text-foreground hover:bg-muted/80'
        }`}
      >
        Book Session <ArrowRight size={18} />
      </button>
    </div>
  );
};

export default CoachingCard;