'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, Brain, Compass, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  useEffect(() => {
    document.title = 'Limitless Motion | Premium Wellness & Transformation'
  }, [])

  return (
    <>
      <section className="relative min-h-[100dvh] flex items-center pt-24 pb-16 overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>

        <div className="container-luxury relative z-10 w-full mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-accent font-medium tracking-[0.2em] uppercase text-sm mb-8 border-b border-accent/40 pb-2">
                Elevate Your Standard
              </span>
              <h1 className="heading-display mb-8">
                Master Your Body. <br />
                <span className="font-serif italic text-primary">Elevate Your Mind.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                Experience a sophisticated approach to personal transformation. We blend elite performance training with mindful recovery for the modern high-achiever.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button asChild size="lg" className="btn-premium w-full sm:w-auto">
                  <Link href="/pricing-coaching">
                    Begin Your Journey <ArrowRight className="ml-3 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="btn-premium-outline w-full sm:w-auto">
                  <Link href="/about">
                    Discover Our Philosophy
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-card border-y border-border">
        <div className="container-luxury">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="heading-section mb-6">The Four Pillars of Excellence</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A comprehensive methodology designed to cultivate physical dominance, mental clarity, and refined nutritional habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-10 border border-border hover:border-primary transition-all duration-300 flex flex-col h-full items-start rounded-lg group shadow-sm hover:shadow-md">
              <div className="w-12 h-12 text-primary mb-8 group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                <Activity className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground tracking-wide">Burn & Move</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-grow text-sm">
                Elite programming focused on functional strength, cardiovascular endurance, and dynamic mobility.
              </p>
              <Link href="/move" className="text-xs font-semibold uppercase tracking-[0.1em] text-primary hover:text-accent transition-colors flex items-center mt-auto">
                Explore Movement <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-background p-10 border border-border hover:border-primary transition-all duration-300 flex flex-col h-full items-start rounded-lg group shadow-sm hover:shadow-md">
              <div className="w-12 h-12 text-primary mb-8 group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                <Compass className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground tracking-wide">Fuel & Align</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-grow text-sm">
                Sophisticated nutritional strategies, including Ethiopian fasting protocols and macro optimization.
              </p>
              <Link href="/fuel" className="text-xs font-semibold uppercase tracking-[0.1em] text-primary hover:text-accent transition-colors flex items-center mt-auto">
                Explore Nutrition <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-background p-10 border border-border hover:border-primary transition-all duration-300 flex flex-col h-full items-start rounded-lg group shadow-sm hover:shadow-md">
              <div className="w-12 h-12 text-primary mb-8 group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                <Brain className="w-full h-full" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground tracking-wide">Think & Track</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-grow text-sm">
                Cognitive conditioning, mindset architecture, and precise progression analytics.
              </p>
              <Link href="/think" className="text-xs font-semibold uppercase tracking-[0.1em] text-primary hover:text-accent transition-colors flex items-center mt-auto">
                Explore Mindset <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="bg-secondary p-10 border border-secondary hover:border-accent transition-all duration-300 flex flex-col h-full items-start rounded-lg relative overflow-hidden group shadow-sm hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
              <div className="relative z-10 w-full h-full flex flex-col">
                <div className="w-12 h-12 text-accent mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-full h-full" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-secondary-foreground tracking-wide">Premium Coaching</h3>
                <p className="text-secondary-foreground/80 leading-relaxed mb-8 flex-grow text-sm">
                  Bespoke 1-on-1 guidance tailored entirely to your sophisticated lifestyle demands.
                </p>
                <Link href="/pricing-coaching" className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary-foreground hover:text-accent transition-colors flex items-center mt-auto">
                  View Tiers <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-background text-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-card via-background to-background pointer-events-none"></div>
        <div className="container-luxury text-center relative z-10">
          <h2 className="heading-section mb-6">Ready to Transform?</h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the Limitless Motion community today and redefine what your mind and body are capable of.
          </p>
          <Button asChild size="lg" className="btn-premium">
            <Link href="/signup">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
