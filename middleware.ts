import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/' ||
        path.startsWith('/auth/callback') ||
        path.startsWith('/api/auth') ||
        path.startsWith('/_next') ||
        path.startsWith('/static') ||
        path.includes('.')

    const token = request.cookies.get('sb_access_token')?.value || ''

    if (isPublicPath) {
        return NextResponse.next()
    }

    if (!token) {
        // Redirect to home page if not authenticated
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
