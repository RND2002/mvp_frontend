import { NextResponse } from 'next/server'
import supabase from "@/app/api/supabaseClient"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone } = body

        if (!phone) {
            return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
        }

        const { error } = await supabase.auth.signInWithOtp({
            phone,
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
