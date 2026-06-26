import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Loader2, Image as ImageIcon } from 'lucide-react';
import { getHighProteinMeals } from '@/db';

const ProteinSnacksSection = () => {
  const [snacks, setSnacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const records = await getHighProteinMeals({ category: 'snack', limit: 10 });

        let fetchedSnacks = records || [];

        if (fetchedSnacks.length === 0) {
          fetchedSnacks = [
            { 
              id: 'snack-1',
              name: "Greek Yogurt (Plain)", 
              calories_total: 150,
              protein_grams: 15,
              image_url: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/6bb01ef1eb4fd954c7bc71f7d8928952.png" 
            },
            { 
              id: 'snack-2',
              name: "Protein Bars (Chocolate/Vanilla)", 
              calories_total: 220,
              protein_grams: 20,
              image_url: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/62f7d8a32f3a30217983d127ecd3ce27.png" 
            },
            { 
              id: 'snack-3',
              name: "Mixed Yogurt Bowl with Berries", 
              calories_total: 250,
              protein_grams: 18,
              image_url: "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/6bb01ef1eb4fd954c7bc71f7d8928952.png" 
            }
          ];
        }

        setSnacks(fetchedSnacks);
      } catch (err) {
        console.error("Error fetching snacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
  }, []);

  const getImageUrl = (snack) => {
    if (snack.image_url && snack.image_url.startsWith('http')) {
      return snack.image_url;
    }
    if (snack.name?.toLowerCase().includes('greek yogurt') || snack.name?.toLowerCase().includes('yogurt')) {
       return "https://horizons-cdn.hostinger.com/c08aaf74-fefb-4823-ab59-73a42ac7ff97/6bb01ef1eb4fd954c7bc71f7d8928952.png";
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (snacks.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-secondary/50 text-secondary-foreground px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs mb-4">
          <Zap className="w-4 h-4 text-primary" /> On-the-Go Fuel
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">High-Performance Snacks</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Maintain your macro targets between primary meals. These selections offer the perfect balance of convenience and precise caloric control.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {snacks.map((snack, index) => {
          const imageUrl = getImageUrl(snack);
          
          return (
            <motion.div 
              key={snack.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <Card className="h-full border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
                {imageUrl ? (
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={snack.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="bg-background/95 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm inline-flex items-center tabular-nums">
                        {snack.calories_total || snack.calories || 0} <span className="text-muted-foreground text-xs font-medium ml-1">kcal</span>
                      </div>
                      {snack.protein_grams && (
                        <div className="text-primary-foreground bg-primary px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm tabular-nums">
                          {snack.protein_grams}g Pro
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-background/95 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm inline-flex items-center tabular-nums">
                        {snack.calories_total || snack.calories || 0} kcal
                      </div>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-5 flex-grow flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-card-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {snack.name}
                  </h3>
                  {snack.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {snack.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProteinSnacksSection;
