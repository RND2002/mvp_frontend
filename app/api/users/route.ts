
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, phone } = body

        // Verify session/auth
        const cookieStore = await cookies()
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${cookieStore.get('sb_access_token')?.value}`,
                    },
                },

            }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Upsert user data
        const updates: any = {
            id: user.id,
            role: 'customer',
        }
        if (email) updates.email = email;
        if (phone) updates.phone = phone;

        // ignoreDuplicates: true -> "If does not exist then create, otherwise leave it"
        const { error: upsertError } = await supabase.from('users').upsert(updates, { onConflict: 'id', ignoreDuplicates: true })

        if (upsertError) {
            console.error("Failed to save user:", upsertError)
            return NextResponse.json({ error: upsertError.message }, { status: 500 })
        }

        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
