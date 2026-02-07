import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { backend } from '@/app/lib/backend-client'

export async function POST() {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('sb_refresh_token')

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
        }

        const res = await backend.post('/auth/refresh')

        if (!res.success) {
            return NextResponse.json({ error: res.error || 'Session expired' }, { status: 401 })
        }

        cookieStore.set('sb_access_token', res.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600, // 1 hour
        })

        // Backend might handle refresh token rotation
        if (res.refresh_token) {
            cookieStore.set('sb_refresh_token', res.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60, // 30 days
            })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Refresh Token Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
