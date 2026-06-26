'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Shield, Scale, HeartPulse, CreditCard, Lock, FileText, AlertTriangle, Gavel } from 'lucide-react'

const sections = [
  { id: 'user-responsibilities', title: 'User Responsibilities & Code of Conduct', icon: <Shield className="w-5 h-5" /> },
  { id: 'intellectual-property', title: 'Intellectual Property Rights', icon: <FileText className="w-5 h-5" /> },
  { id: 'health-disclaimers', title: 'Health & Nutrition Disclaimers', icon: <HeartPulse className="w-5 h-5" /> },
  { id: 'liability', title: 'Liability Limitations', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'payment', title: 'Payment & Refund Policy', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'privacy', title: 'Data Privacy & Security', icon: <Lock className="w-5 h-5" /> },
  { id: 'membership', title: 'Membership Terms & Conditions', icon: <Shield className="w-5 h-5" /> },
  { id: 'ugc', title: 'User-Generated Content Rights', icon: <FileText className="w-5 h-5" /> },
  { id: 'modifications', title: 'Service Modifications', icon: <Scale className="w-5 h-5" /> },
  { id: 'termination', title: 'Account Termination', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'dispute', title: 'Dispute Resolution', icon: <Gavel className="w-5 h-5" /> },
  { id: 'governing-law', title: 'Governing Law & Jurisdiction', icon: <Scale className="w-5 h-5" /> },
  { id: 'contact', title: 'Contact Information', icon: <FileText className="w-5 h-5" /> },
]

export default function TermsAndConditionsPage() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    document.title = 'Terms & Conditions - Limitless Motion'
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id))
      const current = sectionElements.find(element => {
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top >= 0 && rect.top <= 300
      })
      if (current) {
        setActiveSection(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div>
      <div className="pt-32 pb-20 bg-muted/30 border-b border-border">
        <div className="container-luxury">
          <div className="max-w-3xl">
            <h1 className="heading-display mb-6">Terms & Conditions</h1>
            <p className="text-xl text-muted-foreground mb-4">
              Please read these terms carefully before using Limitless Motion services.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full text-sm font-medium text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              Last Updated: March 30, 2026
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 p-6 bg-card border border-border rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-6">Table of Contents</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-lg transition-colors ${
                      activeSection === section.id 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className={activeSection === section.id ? 'text-primary' : 'text-muted-foreground/50'}>
                      {section.icon}
                    </span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-8 prose-legal">
            <p className="text-lg">
              Welcome to Limitless Motion. By accessing our website, mobile applications, or utilizing our nutrition and fitness services, you agree to be bound by these Terms and Conditions.
            </p>

            <section id="user-responsibilities">
              <h2>1. User Responsibilities & Code of Conduct</h2>
              <p>As a user of Limitless Motion, you agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information during the registration process.</li>
                <li>Maintain the security and confidentiality of your account credentials.</li>
                <li>Use the platform solely for personal, non-commercial purposes.</li>
                <li>Refrain from using the service to distribute spam, malware, or engage in any unlawful activities.</li>
                <li>Respect the community and refrain from harassing, abusing, or harming other users or staff.</li>
              </ul>
            </section>

            <section id="intellectual-property">
              <h2>2. Intellectual Property Rights</h2>
              <p>
                All content, features, and functionality on the Limitless Motion platform—including but not limited to text, graphics, logos, meal plans, workout routines, and software—are the exclusive property of Limitless Motion and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You are granted a limited, non-exclusive, non-transferable license to access and use the platform for your personal use. You may not reproduce, distribute, modify, or create derivative works from our content without explicit written consent.
              </p>
            </section>

            <section id="health-disclaimers">
              <h2>3. Health & Nutrition Disclaimers</h2>
              <p>
                <strong>Not Medical Advice:</strong> The meal plans, nutritional information, and workout routines provided by Limitless Motion are for educational and informational purposes only. They do not constitute medical advice, diagnosis, or treatment.
              </p>
              <p>
                Always consult with a qualified healthcare professional before beginning any new diet, fasting regimen, or exercise program, especially if you have pre-existing health conditions, are pregnant, or are nursing. Your use of our nutritional recommendations is solely at your own risk.
              </p>
            </section>

            <section id="liability">
              <h2>4. Liability Limitations</h2>
              <p>
                To the maximum extent permitted by law, Limitless Motion and its affiliates, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to personal injury, loss of profits, data, or use, resulting from:
              </p>
              <ul>
                <li>Your access to or use of or inability to access or use the services.</li>
                <li>Any conduct or content of any third party on the services.</li>
                <li>Any content obtained from the services.</li>
              </ul>
            </section>

            <section id="payment">
              <h2>5. Payment & Refund Policy</h2>
              <p>
                Certain features of Limitless Motion require a paid subscription. By selecting a premium service, you agree to pay all applicable fees.
              </p>
              <ul>
                <li><strong>Billing:</strong> Subscriptions are billed in advance on a recurring basis.</li>
                <li><strong>Cancellations:</strong> You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing cycle.</li>
                <li><strong>Refunds:</strong> We offer a 14-day money-back guarantee for new subscribers. After 14 days, all payments are non-refundable unless required by applicable law.</li>
              </ul>
            </section>

            <section id="privacy">
              <h2>6. Data Privacy & Security</h2>
              <p>
                Your privacy is critical to us. Our collection and use of personal information in connection with the services are described in our Privacy Policy. By using our services, you consent to the collection, use, and sharing of your data as outlined in that policy.
              </p>
            </section>

            <section id="membership">
              <h2>7. Membership Terms & Conditions</h2>
              <p>
                Memberships are strictly personal and non-transferable. Account sharing is strictly prohibited and may result in immediate termination of your account without a refund. We reserve the right to modify membership tiers, features, and pricing with 30 days' notice to active subscribers.
              </p>
            </section>

            <section id="ugc">
              <h2>8. User-Generated Content Rights</h2>
              <p>
                If you post, upload, or share content (such as progress photos, recipe modifications, or forum posts) on our platform, you grant Limitless Motion a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content in connection with operating and promoting the services. You represent that you own or have the necessary rights to the content you share.
              </p>
            </section>

            <section id="modifications">
              <h2>9. Service Modifications</h2>
              <p>
                We reserve the right to modify, suspend, or discontinue, temporarily or permanently, the services or any part thereof with or without notice. You agree that Limitless Motion will not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>

            <section id="termination">
              <h2>10. Account Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions. Upon termination, your right to use the services will immediately cease.
              </p>
            </section>

            <section id="dispute">
              <h2>11. Dispute Resolution</h2>
              <p>
                Any disputes arising out of or relating to these Terms or the services will be resolved through binding arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify. You agree to waive any right to a jury trial or to participate in a class action.
              </p>
            </section>

            <section id="governing-law">
              <h2>12. Governing Law & Jurisdiction</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Limitless Motion is registered, without regard to its conflict of law provisions.
              </p>
            </section>

            <section id="contact">
              <h2>13. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-muted p-6 rounded-xl mt-4">
                <p className="mb-1"><strong>Email:</strong> support@limitlessmotion.com</p>
                <p className="mb-1"><strong>Website:</strong> www.limitlessmotion.com</p>
                <p className="mb-0"><strong>Founded by:</strong> Loza Mengistu</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
