import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { access_token, refresh_token } = body

        if (!access_token) {
            return NextResponse.json({ error: 'No access token provided' }, { status: 400 })
        }

        const cookieStore = await cookies()
        // Set the cookie with a long expiration (e.g., 1 week) to match typical session lengths
        cookieStore.set('sb_access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        if (refresh_token) {
            cookieStore.set('sb_refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60
            })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
