import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: order, error } = await supabaseClient
            .from("orders")
            .select(`
                *,
                order_items (
                    *,
                    product:products(*)
                ),
                order_fulfillments (
                    *
                )
            `)
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
