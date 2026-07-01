import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const authProtectedPaths = [
  '/dashboard', '/membership-upgrade', '/success', '/cancel',
  '/align', '/burn', '/move', '/threads',
  '/fuel', '/track', '/ethiopian-fasting', '/ethiopian-non-fasting',
  '/calorie-calculator', '/meal-plan',
  '/community', '/admin'
]

const premiumPaths = [
  '/dashboard', '/align', '/burn', '/move',
  '/fuel', '/track', '/threads',
  '/ethiopian-fasting', '/ethiopian-non-fasting',
  '/calorie-calculator', '/meal-plan',
  '/community',
]

const freeAuthPaths = [
  '/membership-upgrade', '/success', '/cancel',
  '/community',
]

const publicPaths = [
  '/', '/about', '/pricing-coaching', '/login', '/signup',
  '/terms', '/calculator', '/podcasts-interviews', '/apparel',
]

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const isAuthProtected = authProtectedPaths.some(path => pathname.startsWith(path))
  const isPublic = publicPaths.some(path => pathname === path) || pathname === '/'
  const isPremium = premiumPaths.some(path => pathname.startsWith(path))

  if (!isAuthProtected && !isPublic) {
    return NextResponse.next()
  }

  if (isPublic) {
    return NextResponse.next()
  }

  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes — check role
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // Premium routes — check is_premium
  if (isPremium) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, role')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_premium && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/membership-upgrade', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
}
