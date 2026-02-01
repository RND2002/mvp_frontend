import { NextResponse } from 'next/server'
import { backend } from '@/app/lib/backend-client'

export async function GET() {
    try {
        const res = await backend.get('/users/vehicles')

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 })
        }

        return NextResponse.json({ vehicles: res.vehicles })
    } catch (err) {
        console.error('GET My Vehicles Error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const res = await backend.post('/vehicles', body)

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 })
        }

        return NextResponse.json(res)
    } catch (err) {
        console.error('POST My Vehicle Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
