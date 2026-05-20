import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, role } = body

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
        }

        const response = await fetch(`${BACKEND_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
            cache: 'no-store',
        })

        const res = await response.json().catch(() => ({}))

        if (!response.ok || !res.success) {
            return NextResponse.json({ error: res.error || 'Signup failed' }, { status: 400 })
        }

        const cookieStore = await cookies()
        cookieStore.set('sb_access_token', res.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600,
        })

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
            user: res.user,
            token: res.token
        }, { status: 201 })
    } catch (error) {
        console.error('Email Signup Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
