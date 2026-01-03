import { NextResponse } from 'next/server'
import supabase from '@/app/api/supabaseClient'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('sb_refresh_token')

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken.value,
        })

        if (error || !data.session) {
            return NextResponse.json({ error: 'Session expired' }, { status: 401 })
        }

        cookieStore.set('sb_access_token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: data.session.expires_in,
        })

        cookieStore.set('sb_refresh_token', data.session.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
