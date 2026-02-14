import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales: ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'ar', 'zh', 'ja', 'ko', 'hi', 'tr', 'ru', 'sv', 'pl', 'id', 'th', 'vi', 'ur'],
  defaultLocale: 'en',
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Apply intl middleware first
  const intlResponse = intlMiddleware(request);
  
  // Extract locale from pathname
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
  
  // Protected routes
  const isDashboard = pathnameWithoutLocale.startsWith('/dashboard');
  const isAdmin = pathnameWithoutLocale.startsWith('/admin');
  
  if (isDashboard || isAdmin) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      const locale = pathname.split('/')[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check admin role for admin routes
    if (isAdmin && token.role !== 'ADMIN') {
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
  }
  
  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
