import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { backend } from '@/app/lib/backend-client'

export async function POST() {
    try {
        await backend.post('/auth/logout')

        const cookieStore = await cookies()

        // Clear cookies
        cookieStore.set('sb_access_token', '', { maxAge: 0 })
        cookieStore.set('sb_refresh_token', '', { maxAge: 0 })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Logout Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
