'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RecipeDetails = ({ ingredients, instructions }) => {
  const [open, setOpen] = useState(false);

  const ingredientList = Array.isArray(ingredients) ? ingredients : [];
  const hasIngredients = ingredientList.length > 0 || (typeof ingredients === 'string' && ingredients.trim());
  const hasInstructions = instructions && typeof instructions === 'string' && instructions.trim();

  if (!hasIngredients && !hasInstructions) return null;

  return (
    <div className="border-t border-border mt-4 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
      >
        <span>Recipe Details</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="recipe-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {hasIngredients && (
              <div className="mt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Ingredients</h4>
                <ul className="space-y-1.5">
                  {ingredientList.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      {typeof item === 'string' ? item : item.amount ? `${item.amount} ${item.name || ''}` : item.name || item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {hasInstructions && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Instructions</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {instructions}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeDetails;