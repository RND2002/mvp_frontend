import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { backend } from '@/app/lib/backend-client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, email, otp } = body

        if ((!phone && !email) || !otp) {
            return NextResponse.json({ error: 'Phone/Email and OTP required' }, { status: 400 })
        }

        const res = await backend.post('/auth/verify', { phone, email, otp })

        if (!res.success) {
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

        // Backend should handle refresh token via cookies if possible, 
        // but here we follow the existing pattern of returning it or setting it if provided.
        if (res.refresh_token) {
            cookieStore.set('sb_refresh_token', res.refresh_token, {
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
