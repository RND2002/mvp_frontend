import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

const getCookieValueFromHeader = (header: string | null, name: string) => {
    if (!header) return null
    const match = header.match(new RegExp(`${name}=([^;]+)`))
    return match?.[1] || null
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, email, otp } = body

        if ((!phone && !email) || !otp) {
            return NextResponse.json({ error: 'Phone/Email and OTP required' }, { status: 400 })
        }

        const response = await fetch(`${BACKEND_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, email, otp }),
            cache: 'no-store',
        })

        const res = await response.json().catch(() => ({}))

        if (!response.ok || !res.success) {
            return NextResponse.json({ error: res.error || 'Invalid OTP' }, { status: 401 })
        }

        const { token, user } = res
        const cookieStore = await cookies()

        // Set access token cookie
        cookieStore.set('sb_access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // Default to 1 hour if not provided by backend
        })

        const setCookieHeader = response.headers.get('set-cookie')
        const refreshToken = res.refresh_token || getCookieValueFromHeader(setCookieHeader, 'sb_refresh_token')

        if (refreshToken) {
            cookieStore.set('sb_refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60,
            })
        }

        return NextResponse.json({
            success: true,
            user,
            token
        }, { status: 200 })
    } catch (error) {
        console.error('Verify OTP Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
