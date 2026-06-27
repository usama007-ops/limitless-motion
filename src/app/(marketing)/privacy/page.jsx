'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  useEffect(() => { document.title = 'Privacy Policy - Limitless Motion' }, [])

  return (
    <main className="flex-grow pt-32 pb-24">
      <div className="container-luxury max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
            <Shield size={16} /> Legal
          </div>
          <h1 className="heading-display mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: June 2026</p>
        </motion.div>

        <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including name, email address, and payment information when you create an account or make a purchase.</p>
            <p>We also automatically collect certain information when you visit our platform, including your IP address, browser type, and usage patterns.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send technical notices, and communicate with you about your account.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing</h2>
            <p>We do not sell your personal information. We may share data with trusted third-party service providers who assist us in operating our platform, conducting business, or serving our users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information at any time. Contact us at support@limitlessmotion.com for assistance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact us at support@limitlessmotion.com.</p>
          </section>
        </div>
      </div>
    </main>
  )
}
