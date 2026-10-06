import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('ephemeral-token')?.value

  // Protected route checking
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set(
      'next',
      request.nextUrl.pathname + request.nextUrl.search
    )
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/subscriptions',
    '/subscriptions/:path*',
    '/api-keys',
    '/api-keys/:path*',
    '/usage',
    '/usage/:path*',
    '/settings',
    '/settings/:path*',
    '/publisher',
    '/publisher/:path*',
  ],
}
