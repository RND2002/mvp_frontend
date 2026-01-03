import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import supabase from '@/app/api/supabaseClient'

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const token = cookieStore.get('sb_access_token')?.value

    if (!token) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            id: user.id,
            phone: user.phone,
            email: user.email
        }
    })
}
