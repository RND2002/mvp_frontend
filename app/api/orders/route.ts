import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        let query = supabaseClient
            .from('orders')
            .select('*, order_items(*), order_fulfillments(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (vehicle_id) {
            query = query.eq('vehicle_id', vehicle_id);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching orders:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            orders: data,
            pagination: {
                page,
                limit,
                hasMore: data && data.length === limit // Simple heuristic
            }
        });

    } catch (err: any) {
        console.error("GET Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}