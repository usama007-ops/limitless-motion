'use client'

import { useEffect } from 'react'
import MembershipCard from '@/components/pricing/MembershipCard.jsx'
import CoachingCard from '@/components/pricing/CoachingCard.jsx'
import StrategyCallCard from '@/components/pricing/StrategyCallCard.jsx'
import BookingForm from '@/components/pricing/BookingForm.jsx'

export default function PricingCoachingPage() {
  useEffect(() => {
    document.title = 'Pricing & Coaching - Limitless Motion'
  }, [])

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1647645426550-c36f3727ec71?q=80&w=2070&auto=format&fit=crop" 
            alt="Athletic training" 
            className="w-full h-full object-cover object-center mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-primary mix-blend-multiply"></div>
        </div>
        
        <div className="container-luxury relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-accent/10 text-accent font-bold tracking-widest uppercase text-sm mb-6 border border-accent/30">
            Invest in Yourself
          </span>
          <h1 className="heading-display text-primary-foreground mb-6 max-w-4xl mx-auto font-serif">
            This is more than training — this is transformation.
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto font-light">
            Choose the path that fits your goals. From comprehensive digital memberships to personalized one-on-one coaching.
          </p>
        </div>
      </section>

      <section className="py-24 bg-background border-b border-border">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-4 text-primary font-serif font-bold">Limitless Motion Digital Membership</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Everything you need to manage your nutrition and training independently, with the tools and recipes to succeed.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <MembershipCard />
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-b border-border">
        <div className="container-luxury">
          <div className="text-center mb-16">
            <h2 className="heading-section mb-4 text-primary font-serif font-bold">One-on-One Coaching</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Accelerate your progress with personalized guidance, mindset coaching, and actionable strategies tailored to your unique lifestyle.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            <StrategyCallCard />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CoachingCard 
                title="Focused Session"
                duration="30-min"
                price="80"
                description="A concentrated session to tackle specific hurdles, adjust your current plan, or get expert advice on a particular topic."
                features={[
                  "Targeted problem solving",
                  "Form or routine review",
                  "Quick macro adjustments",
                  "Actionable takeaways"
                ]}
                isPopular={false}
              />
              <CoachingCard 
                title="Deep Dive Coaching"
                duration="60-min"
                price="150"
                description="Comprehensive coaching covering mindset, detailed nutritional strategy, and long-term lifestyle integration."
                features={[
                  "In-depth lifestyle analysis",
                  "Customized strategy development",
                  "Mindset and habit coaching",
                  "Detailed follow-up notes"
                ]}
                isPopular={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-luxury">
          <BookingForm />
        </div>
      </section>
    </>
  )
}
