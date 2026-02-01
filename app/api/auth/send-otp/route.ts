import { NextResponse } from 'next/server'
import { backend } from '@/app/lib/backend-client'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { phone, email } = body

        if (!phone && !email) {
            return NextResponse.json({ error: 'Phone number or Email required' }, { status: 400 })
        }

        const res = await backend.post('/auth/otp', { phone, email })

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: 400 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('Send OTP Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
