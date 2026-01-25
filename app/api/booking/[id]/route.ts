import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: booking, error } = await supabaseClient
            .from("bookings")
            .select(`
                *,
                service:services(
                    *,
                    service_items(*),
                    service_pricing(*)
                ),
                vehicle:vehicles(*),
                items:booking_items(*),
                events:booking_events(*),
                garage:garage!bookings_garage_id_fkey(*)
            `)
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching booking:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, booking });

    } catch (err) {
        console.error("GET Booking By ID Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
