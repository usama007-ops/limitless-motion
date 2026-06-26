import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import FoodListCard from './FoodListCard.jsx';
import { Button } from '@/components/ui/button';

const FoodListSection = ({ title, description, foods, type }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Derive filter options based on type
  const filterOptions = useMemo(() => {
    if (type === 'ethiopian') {
      return ['All', 'fasting', 'non-fasting'];
    } else {
      const regions = [...new Set(foods.map(f => f.region))];
      return ['All', ...regions].slice(0, 6); // Keep it to 6 max for UI
    }
  }, [foods, type]);

  // Filter foods
  const filteredFoods = useMemo(() => {
    if (activeFilter === 'All') return foods;
    if (type === 'ethiopian') return foods.filter(f => f.category === activeFilter);
    if (type === 'global') return foods.filter(f => f.region === activeFilter);
    return foods;
  }, [foods, activeFilter, type]);

  const formatFilterName = (filter) => {
    if (filter === 'All') return 'All Options';
    if (filter === 'fasting') return 'Fasting (Vegan)';
    if (filter === 'non-fasting') return 'Non-Fasting';
    return filter;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight mb-3">{title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 sm:mx-0 scrollbar-hide gap-3">
        {filterOptions.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'default' : 'outline'}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full whitespace-nowrap font-bold transition-all ${
              activeFilter === filter 
                ? 'shadow-md' 
                : 'bg-transparent hover:bg-muted/50'
            }`}
          >
            {formatFilterName(filter)}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {filteredFoods.length === 0 ? (
        <div className="bg-muted/30 rounded-2xl p-16 text-center border border-border border-dashed flex flex-col items-center">
          <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-xl font-bold text-foreground mb-2">No foods found</p>
          <p className="text-muted-foreground">Adjust your filters to see more options.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
              >
                <FoodListCard food={food} type={type} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FoodListSection;