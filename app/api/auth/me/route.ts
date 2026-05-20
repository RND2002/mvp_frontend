import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/app/lib/auth'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

const getCookieValueFromHeader = (header: string | null, name: string) => {
    if (!header) return null
    const match = header.match(new RegExp(`${name}=([^;]+)`))
    return match?.[1] || null
}

async function refreshSession() {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('sb_refresh_token')?.value

    if (!refreshToken) return false

    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `sb_refresh_token=${refreshToken}`,
        },
        cache: 'no-store',
    })

    const res = await response.json().catch(() => ({}))
    if (!response.ok || !res.success || !res.token) return false

    cookieStore.set('sb_access_token', res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600,
    })

    const rotatedRefreshToken = res.refresh_token || getCookieValueFromHeader(response.headers.get('set-cookie'), 'sb_refresh_token')
    if (rotatedRefreshToken) {
        cookieStore.set('sb_refresh_token', rotatedRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
        })
    }

    return true
}

export async function GET() {
    let { user, error } = await getAuthenticatedUser()

    if (error || !user) {
        const refreshed = await refreshSession()
        if (refreshed) {
            const retry = await getAuthenticatedUser()
            user = retry.user
            error = retry.error
        }
    }

    if (error || !user) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            id: user.id,
            phone: user.phone,
            email: user.email,
        }
    })
}
