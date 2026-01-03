import { NextResponse } from 'next/server'
import supabase from '@/app/api/supabaseClient'
import { cookies } from 'next/headers'

export async function POST() {
    try {
        await supabase.auth.signOut()

        const cookieStore = await cookies()

        // Clear cookies
        cookieStore.set('sb_access_token', '', { maxAge: 0 })
        cookieStore.set('sb_refresh_token', '', { maxAge: 0 })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
