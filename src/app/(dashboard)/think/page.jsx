'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Wind, PlayCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAffirmations } from '@/db';

const fallbackAffirmations = [
  { id: '1', text: 'I am capable of more than I know. Today, I choose to push my boundaries.' },
  { id: '2', text: 'Strength does not come from the body. It comes from the will.' },
  { id: '3', text: 'The only bad workout is the one that didn\'t happen.' },
];

const ThinkPage = () => {
  const [affirmations, setAffirmations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'THINK | Limitless Motion';
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAffirmations({ limit: 10 });
        if (cancelled) return;
        if (data && data.length > 0) {
          setAffirmations(data);
        } else {
          setAffirmations(fallbackAffirmations);
        }
      } catch {
        if (!cancelled) setAffirmations(fallbackAffirmations);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-16 shadow-lg"
        >
          <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-6 uppercase tracking-widest font-bold">
              <Brain className="w-4 h-4 mr-2 inline" /> Mental Training
            </Badge>
            <h1 className="heading-display mb-6">Fortify Your Mind.</h1>
            <p className="text-xl md:text-2xl font-medium opacity-90 mb-8">
              Access daily affirmations, mindset resources, and guided mindfulness workouts to stay focused, resilient, and centered.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="heading-section mb-6 flex items-center gap-3">
                <Wind className="text-[hsl(var(--brand-think))] w-6 h-6" /> Guided Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border/60 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">Pre-Workout</Badge>
                    <h3 className="text-xl font-bold mb-2">Focus & Intent</h3>
                    <p className="text-sm text-muted-foreground">5 min • Prepare your mind for the physical work ahead.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/60 hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center relative group cursor-pointer">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">Post-Workout</Badge>
                    <h3 className="text-xl font-bold mb-2">Downregulation</h3>
                    <p className="text-sm text-muted-foreground">10 min • Shift from sympathetic to parasympathetic state.</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="heading-section mb-6 flex items-center gap-3">
                <Sparkles className="text-[hsl(var(--brand-think))] w-6 h-6" /> Daily Affirmations
              </h2>
              <div className="space-y-4">
                {affirmations.length > 0 ? (
                  affirmations.map((item) => (
                    <Card key={item.id} className="bg-card border-border/50 shadow-sm rounded-2xl overflow-hidden relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[hsl(var(--brand-think))]/60"></div>
                      <CardContent className="p-6">
                        <p className="text-lg font-medium leading-relaxed">"{item.text}"</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-card border-border/50 shadow-sm rounded-2xl overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[hsl(var(--brand-think))]/60"></div>
                    <CardContent className="p-6">
                      <p className="text-lg font-medium leading-relaxed">"I am capable of more than I know. Today, I choose to push my boundaries."</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkPage;
