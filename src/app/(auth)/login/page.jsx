'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import InfinityLogo from '@/components/InfinityLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-card via-background to-background pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <Link href="/" className="inline-block mb-8">
            <InfinityLogo className="scale-125" />
          </Link>
          <h1 className="text-3xl font-serif font-medium text-foreground mb-2 tracking-wide">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to continue your journey.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-md">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-muted-foreground uppercase tracking-[0.1em] text-[11px] font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input border-border text-foreground focus:ring-2 focus:ring-ring rounded-md h-12"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-muted-foreground uppercase tracking-[0.1em] text-[11px] font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input border-border text-foreground focus:ring-2 focus:ring-ring rounded-md h-12"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium mt-8 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center space-y-6">
            <Link href="/reset-password" className="text-xs text-muted-foreground hover:text-accent transition-colors duration-300 block uppercase tracking-wide">
              Forgot your password?
            </Link>
            <div className="text-xs text-muted-foreground pt-6 border-t border-border uppercase tracking-wide">
              New to Limitless Motion?{' '}
              <Link href="/signup" className="text-primary hover:text-accent transition-colors font-semibold ml-2">
                Join the Movement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
