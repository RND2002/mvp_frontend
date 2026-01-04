import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser()

        if (authError || !user) {
            return NextResponse.json({ error: authError || 'Unauthorized' }, { status: 401 })
        }

        const { data, error } = await supabaseClient
            .from('vehicles')
            .insert({
                user_id: user.id,
                type: body.type,
                brand: body.brand,
                model: body.model,
                year: Number(body.year),
                fuel_type: body.fuel_type,
                registration_number: body.registration_number,
                // variant is excluded as it doesn't exist in DB
            })
            .select()
            .single()

        if (error) {
            console.error("Supabase Error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, vehicle: data }, { status: 200 })
    } catch (err) {
        console.error("Catch Error:", err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

