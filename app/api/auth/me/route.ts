import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/app/lib/auth'

export async function GET(request: Request) {
    const { user, error } = await getAuthenticatedUser()

    if (error || !user) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
        authenticated: true,
        user: {
            id: user.id,
            phone: user.phone,
        }
    })
}
