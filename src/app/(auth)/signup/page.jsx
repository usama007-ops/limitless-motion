'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!termsAccepted) {
      setError('You must agree to the Terms & Conditions to create an account.')
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)

    const result = await signup(
      formData.email,
      formData.password,
      formData.passwordConfirm,
      formData.name
    )

    if (result.success) {
      router.push('/membership-upgrade')
    } else {
      setError(result.error || 'Signup failed. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <span className="font-serif text-3xl font-bold tracking-tight text-primary">
              LIMITLESS MOTION
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Join the Movement</h1>
          <p className="text-muted-foreground text-lg">Create your account to begin.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground uppercase tracking-widest text-xs font-bold">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary rounded-lg h-12"
                placeholder="Maya Chen"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground uppercase tracking-widest text-xs font-bold">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary rounded-lg h-12"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground uppercase tracking-widest text-xs font-bold">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary rounded-lg h-12"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm" className="text-foreground uppercase tracking-widest text-xs font-bold">Confirm Password</Label>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                className="bg-background border-border text-foreground focus:ring-2 focus:ring-primary rounded-lg h-12"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-3 pt-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
                className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer font-medium">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-primary hover:text-accent underline underline-offset-4 transition-colors font-bold">
                  Terms & Conditions
                </Link>{' '}
                of Limitless Motion.
              </Label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium mt-8 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-border pt-6">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-accent transition-colors font-bold tracking-wide uppercase ml-2">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
