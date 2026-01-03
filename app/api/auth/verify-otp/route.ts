import { NextResponse } from 'next/server'
import supabase from '@/app/api/supabaseClient'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, otp } = body

        if (!phone || !otp) {
            return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 })
        }

        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token: otp,
            type: 'sms',
        })

        if (error || !data.session || !data.user) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })
        }

        const { access_token, refresh_token, expires_in } = data.session

        const cookieStore = await cookies()

        cookieStore.set('sb_access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expires_in,
        })

        cookieStore.set('sb_refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        })

        // 👤 Ensure app user exists
        await supabase.from('users').upsert({
            id: data.user.id,
            phone,
        })

        return NextResponse.json({
            success: true,
            user: { id: data.user.id, phone },
            token: access_token
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
