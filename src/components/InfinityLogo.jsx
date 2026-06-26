import React from 'react';
import { cn } from '@/lib/utils';

const InfinityLogo = ({ className, showGlow = true, showText = true }) => {
  return (
    <div className={cn("relative flex items-center gap-4 group", className)}>
      <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 shrink-0">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-full h-full transition-all duration-500 group-hover:scale-105"
        >
          {/* Base Track (Faded) */}
          <path 
            d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" 
            className="opacity-20 text-muted-foreground"
            pathLength="100"
          />

          {/* Single Flowing Track */}
          <path 
            d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"
            className={cn(
              "text-primary transition-all duration-300 group-hover:text-accent",
              showGlow && "group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
            )}
            pathLength="100"
            style={{
              strokeDasharray: '40 60',
              animation: 'flow-infinity 2.5s linear infinite'
            }}
          />
        </svg>
        
        {/* Background ambient glow on hover */}
        {showGlow && (
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 blur-xl rounded-full transition-all duration-500 scale-150 pointer-events-none" />
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-semibold tracking-[0.15em] text-foreground uppercase text-sm md:text-base leading-none group-hover:text-accent transition-colors duration-300">
            Limitless
          </span>
          <span className="font-light tracking-[0.25em] text-muted-foreground uppercase text-[10px] md:text-xs leading-tight mt-1">
            Motion
          </span>
        </div>
      )}
    </div>
  );
};

export default InfinityLogo;