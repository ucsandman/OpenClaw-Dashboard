import { NextResponse } from 'next/server';

/**
 * Authentication middleware for MoltFire Dashboard
 *
 * SECURITY: Protects API routes with API key authentication
 * Set DASHBOARD_API_KEY environment variable in production
 */

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/api/tokens',
  '/api/relationships',
  '/api/goals',
  '/api/learning',
  '/api/workflows',
  '/api/inspiration',
  '/api/bounties',
  '/api/content',
  '/api/schedules',
  '/api/calendar',
  '/api/memory',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected API route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Get API key from header or query param
    const apiKey = request.headers.get('x-api-key') ||
                   request.nextUrl.searchParams.get('api_key');

    // Get expected API key from environment
    const expectedKey = process.env.DASHBOARD_API_KEY;

    // If no API key is configured, allow access (development mode)
    // In production, ALWAYS set DASHBOARD_API_KEY
    if (expectedKey && apiKey !== expectedKey) {
      console.warn(`[SECURITY] Unauthorized API access attempt: ${pathname}`);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Log successful authenticated access
    if (expectedKey && apiKey === expectedKey) {
      console.log(`[AUTH] Authenticated access to ${pathname}`);
    }
  }

  // Add rate limiting headers (for monitoring - actual limiting should be at edge)
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Policy', 'dashboard-api');

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
