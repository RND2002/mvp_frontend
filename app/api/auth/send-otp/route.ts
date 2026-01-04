import { NextResponse } from 'next/server'
import supabase from "@/app/api/supabaseClient"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, email } = body

        if (!phone && !email) {
            return NextResponse.json({ error: 'Phone number or Email required' }, { status: 400 })
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        let error;
        if (email) {
            const { error: err } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${origin}/auth/callback`,
                }
            })
            error = err;
        } else {
            const { error: err } = await supabase.auth.signInWithOtp({
                phone,
            })
            error = err;
        }

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
