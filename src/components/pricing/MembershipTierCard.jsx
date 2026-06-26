import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MembershipTierCard = ({ tier, price, features, isPopular, onSelect, selected, disabled, disabledMessage }) => {
  return (
    <Card className={`relative flex flex-col h-full transition-all duration-300 ${isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'} ${selected ? 'ring-2 ring-primary' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{tier}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md" style={disabled ? { cursor: 'not-allowed' } : {}}>
                <Button 
                  className="w-full" 
                  variant={isPopular ? 'default' : 'outline'}
                  onClick={(e) => {
                    if (disabled) {
                      e.preventDefault();
                      return;
                    }
                    onSelect(tier);
                  }}
                  disabled={disabled}
                  style={disabled ? { pointerEvents: 'none' } : {}}
                >
                  {selected ? 'Selected' : `Select ${tier}`}
                </Button>
              </span>
            </TooltipTrigger>
            {disabled && disabledMessage && (
              <TooltipContent side="bottom" className="max-w-[250px] text-center p-3">
                <p className="font-medium text-sm leading-snug">{disabledMessage}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default MembershipTierCard;