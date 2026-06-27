import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const protectedPaths = [
  '/dashboard', '/membership-upgrade', '/success', '/cancel',
  '/align', '/burn', '/move', '/think', '/threads',
  '/fuel', '/track', '/ethiopian-fasting', '/ethiopian-non-fasting',
  '/calorie-calculator', '/meal-plan',
  '/resources', '/community', '/admin',
  '/lets-think', '/lets-wear',
]

const publicPaths = [
  '/', '/about', '/pricing-coaching', '/login', '/signup',
  '/terms', '/calculator', '/podcasts-interviews', '/apparel',
]

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const isProtected = protectedPaths.some(path => pathname.startsWith(path))
  const isPublic = publicPaths.some(path => pathname === path) || pathname === '/'

  if (!isProtected && !isPublic) {
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

  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
  ],
}
