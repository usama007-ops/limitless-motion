'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Lightbulb, Target, Zap, Lock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { getAffirmations } from '@/db'

const fallbackAffirmations = [
  { id: '1', text: 'You are stronger than your challenges' },
  { id: '2', text: 'Every day is a new opportunity to grow' },
  { id: '3', text: 'Your potential is limitless' },
  { id: '4', text: 'I embrace the rhythm of progress' },
  { id: '5', text: 'My mind is clear, my focus is sharp' },
]

const goalAffirmations = [
  { text: 'I move with purpose and grace through every challenge.' },
  { text: 'My body is a temple, and I honor it with discipline.' },
  { text: 'Growth happens outside my comfort zone.' },
  { text: 'I am in control of my choices and my future.' },
  { text: 'Every rep, every meal, every moment counts.' },
  { text: 'I attract success through consistent effort.' },
  { text: 'My mindset is my greatest asset.' },
  { text: 'I am becoming the person I was meant to be.' },
]

export default function LetsThinkPage() {
  const { isPremium, isAdmin } = useAuth()
  const router = useRouter()
  const hasPremiumAccess = isPremium || isAdmin

  const [affirmations, setAffirmations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Let's Think - Limitless Motion"
  }, [])

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAffirmations({ limit: 50 });
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
  }, [])

  return (
    <main className="flex-grow pt-32 pb-24">
      <div className="container-luxury max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Brain size={16} />
            Mindset & Growth
          </div>
          <h1 className="heading-display mb-4">LET'S THINK</h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl">
            Daily affirmations and mindset exercises to strengthen your mental game.
          </p>
        </motion.div>

        <section className="mb-20">
          <h2 className="text-2xl font-serif font-medium mb-8 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-accent" />
            Daily Affirmations
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-card rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {affirmations.map((aff, idx) => (
                <motion.div
                  key={aff.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="h-full bg-card border border-border hover:border-primary/40 transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 mt-1">
                          <Zap className="w-4 h-4" />
                        </div>
                        <p className="text-lg font-medium leading-relaxed text-card-foreground/90">{aff.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-serif font-medium mb-8 flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            Goal-Oriented Affirmations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goalAffirmations.map((aff, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-card border border-border hover:border-primary/40 transition-all group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1">
                        <Target className="w-4 h-4" />
                      </div>
                      <p className="text-base leading-relaxed text-card-foreground/80 italic">&ldquo;{aff.text}&rdquo;</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {!hasPremiumAccess && (
            <div className="mt-12 p-8 bg-gradient-to-br from-muted to-background border border-dashed border-accent/40 rounded-2xl text-center">
              <Lock className="w-8 h-8 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-serif font-medium mb-2">Unlock Premium Affirmations</h3>
              <p className="text-muted-foreground mb-6">Get access to exclusive mindset content and personalized affirmations.</p>
              <Button onClick={() => router.push('/pricing-coaching')} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Upgrade Membership
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
