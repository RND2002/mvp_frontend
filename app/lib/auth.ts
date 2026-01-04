import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import supabase from '@/app/api/supabaseClient'

// Helper to get authenticated user or mock user
export async function getAuthenticatedUser() {

    const cookieStore = await cookies()
    const token = cookieStore.get('sb_access_token')?.value

    if (!token) {
        return { user: null, supabaseClient: supabase, error: 'Unauthorized' }
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token)

    if (userError || !userData.user) {
        return { user: null, supabaseClient: supabase, error: 'Invalid session' }
    }

    const authenticatedClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    )

    return {
        user: userData.user,
        supabaseClient: authenticatedClient,
        error: null
    }
}
