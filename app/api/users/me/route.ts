import { NextResponse } from 'next/server'
import { backend } from '@/app/lib/backend-client'

export async function GET() {
    try {
        const res = await backend.get('/users/me')

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 })
        }

        return NextResponse.json(res)
    } catch (error) {
        console.error('GET Users/Me Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
