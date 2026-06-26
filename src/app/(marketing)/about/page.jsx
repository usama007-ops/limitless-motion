'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About - Limitless Motion'
  }, [])

  return (
    <>
      <section className="pt-40 pb-20 relative overflow-hidden border-b border-border bg-primary text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')]"></div>
        <div className="container-luxury relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="heading-display mb-8">Our Story</h1>
            <div className="w-16 h-1 bg-accent mx-auto mb-10 rounded-full"></div>
            <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed">
              Built on the foundation of discipline, science, and authentic self-expression. Limitless Motion is more than a fitness brand; we are a movement.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="heading-section mb-8 text-primary">Meet Loza Mengistu</h2>
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Loza Mengistu is the visionary founder of Limitless Motion, bringing together a unique blend of expertise in data science, fitness coaching, and sports medicine.
                </p>
                <p>
                  With a background rooted in analytical thinking and a passion for human performance, Loza recognized the transformative power of combining physical training with mental discipline and authentic self-expression.
                </p>
                <p>
                  Her approach is grounded in evidence-based methods, personalized coaching, and a deep understanding of how movement shapes not just our bodies, but our entire lives.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-card border border-border rounded-2xl p-10 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
              <h3 className="text-3xl font-serif mb-8 text-primary font-bold">
                Expertise & Background
              </h3>
              <ul className="space-y-6">
                {[
                  'Data Science & Analytics',
                  'Certified Fitness Coach',
                  'Sports Medicine Specialist',
                  'Movement & Mindset Integration'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                    <span className="text-foreground font-medium text-lg tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="heading-section mb-6 text-primary">Why Limitless Motion Exists</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed text-muted-foreground text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Limitless Motion was born from a simple yet powerful belief: that true transformation happens when we align our physical practice with our mental discipline and authentic self-expression.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              We exist to guide individuals beyond surface-level fitness goals. Our mission is to help you build unshakeable confidence, develop mental resilience, and create a lifestyle that reflects your highest potential through Limitless Motion.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 p-8 bg-card border-l-4 border-accent rounded-r-2xl shadow-sm text-left"
            >
              <p className="text-2xl font-serif text-primary italic font-medium">
                "This is more than fitness. This is a movement toward becoming the best version of yourself through Limitless Motion."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
