import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const category = searchParams.get("category");
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

        const id = searchParams.get("id");
        if (id) {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching product by ID:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                product: data
            });
        }


        if (vehicle_id) {
            const { data, error } = await supabaseClient.rpc('get_vehicle_upgrades', {
                p_vehicle_id: vehicle_id,
                p_limit: limit,
                p_offset: offset,
                p_category: category || null
            });


            if (error) {
                console.error("Error fetching products:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            // Note: Total count is not returned by the RPC in this specific call signature. 
            // We'll return the current batch. For full pagination UI, a separate count query or modified RPC is needed.
            // For now, we return what we have.
            return NextResponse.json({
                success: true,
                products: data,
                pagination: {
                    page,
                    limit,
                    hasMore: data && data.length === limit // Simple heuristic
                }
            });
        }

        return NextResponse.json({ error: "Missing required parameters (vehicle_id)" }, { status: 400 });

    } catch (err) {
        console.error("GET Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}