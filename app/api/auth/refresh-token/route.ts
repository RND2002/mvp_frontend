import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

const getCookieValueFromHeader = (header: string | null, name: string) => {
    if (!header) return null
    const match = header.match(new RegExp(`${name}=([^;]+)`))
    return match?.[1] || null
}

export async function POST() {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('sb_refresh_token')?.value

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
        }

        const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `sb_refresh_token=${refreshToken}`,
            },
            cache: 'no-store',
        })

        const res = await response.json().catch(() => ({}))

        if (!response.ok || !res.success) {
            return NextResponse.json({ error: res.error || 'Session expired' }, { status: 401 })
        }

        cookieStore.set('sb_access_token', res.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour
        })

        const setCookieHeader = response.headers.get('set-cookie')
        const rotatedRefreshToken = res.refresh_token || getCookieValueFromHeader(setCookieHeader, 'sb_refresh_token')

        if (rotatedRefreshToken) {
            cookieStore.set('sb_refresh_token', rotatedRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            })
        }

        return NextResponse.json({ success: true, token: res.token }, { status: 200 })
    } catch (error) {
        console.error('Refresh Token Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
