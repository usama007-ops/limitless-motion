import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Sparkles } from 'lucide-react';

const MembershipCard = () => {
  const features = [
    "Personalized 4-week meal planning",
    "Full traditional Ethiopian recipes",
    "Advanced macro calculator access",
    "Fasting & non-fasting season options",
    "Downloadable PDF meal plans",
    "Progress tracking dashboard",
    "Exclusive community access"
  ];

  return (
    <div className="relative bg-secondary text-secondary-foreground rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Sparkles size={16} />
            Premium Access
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Limitless Membership</h3>
          <p className="text-secondary-foreground/80 text-lg mb-8 max-w-md">
            Unlock your full potential with comprehensive nutritional guidance, tailored specifically to your goals and cultural preferences.
          </p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-extrabold">$15</span>
            <span className="text-secondary-foreground/60 font-medium">/ month</span>
          </div>
          <Link to="/signup" className="inline-block w-full md:w-auto text-center bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold tracking-wide transition-all hover:bg-primary/90 hover:shadow-celadon active:scale-[0.98]">
            Join Membership
          </Link>
        </div>
        
        <div className="bg-background/5 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-sm">
          <h4 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">Everything you need to succeed:</h4>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                <span className="text-secondary-foreground/90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;