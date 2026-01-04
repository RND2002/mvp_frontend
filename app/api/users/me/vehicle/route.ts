import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/app/lib/auth'

export async function GET() {
    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser()

        if (authError || !user) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 })
        }

        // Mock mode with admin client will bypass RLS if needed, or just work if we use mock-user-id
        // Note: For mock-user-id to work with RLS enabled on 'vehicles', we usually need Admin client OR 
        // the table allows anon access. Using supabaseAdmin (returned by helper in mock mode) ensures access.

        const { data: vehicles, error } = await supabaseClient
            .from('vehicles')
            .select(`
        id,
        type,
        brand,
        model,
        year,
        fuel_type,
        registration_number,
        created_at
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.log(error, "Error fetching vehicles")
            return NextResponse.json(
                { error: 'Failed to fetch vehicles' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { vehicles },
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser()

        if (authError || !user) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 })
        }

        // Insert actual vehicle using the appropriate client
        const { data, error } = await supabaseClient
            .from('vehicles')
            .insert({
                user_id: user.id,
                ...body
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, vehicle: data }, { status: 200 })

    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
