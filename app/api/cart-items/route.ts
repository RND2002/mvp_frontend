import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { CartStatus } from "@/app/beService/cart-items-service";

export async function POST(request: Request) {
    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { vehicle_id, product_id, quantity, price_snapshot, requires_installation } = body;

        if (!vehicle_id || !product_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Check if an active cart exists for this user and vehicle
        let { data: cart, error: cartError } = await supabaseClient
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .eq('vehicle_id', vehicle_id)
            .eq('status', CartStatus.Active)
            .maybeSingle(); // Use maybeSingle to avoid 406 on no rows

        if (cartError) {
            console.error("Error checking cart:", cartError);
            return NextResponse.json({ error: cartError.message }, { status: 500 });
        }

        // 2. If no active cart, create one
        if (!cart) {
            const { data: newCart, error: createError } = await supabaseClient
                .from('carts')
                .insert({
                    user_id: user.id,
                    vehicle_id: vehicle_id,
                    status: CartStatus.Active
                })
                .select('id')
                .single();

            if (createError) {
                console.error("Error creating cart:", createError);
                return NextResponse.json({ error: createError.message }, { status: 500 });
            }
            cart = newCart;
        }

        // 3. Add Item to Cart (or update if exists? For now, we'll just insert/upsert)
        // Check if item exists in cart to update quantity
        const { data: existingItem } = await supabaseClient
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cart.id)
            .eq('product_id', product_id)
            .maybeSingle();

        let itemData;
        let itemError;

        if (existingItem) {
            // Update quantity
            const { data, error } = await supabaseClient
                .from('cart_items')
                .update({ quantity: existingItem.quantity + quantity }) // Increment
                .eq('id', existingItem.id)
                .select()
                .single();
            itemData = data;
            itemError = error;
        } else {
            // Insert new item
            const { data, error } = await supabaseClient
                .from('cart_items')
                .insert({
                    cart_id: cart.id,
                    product_id: product_id,
                    quantity: quantity,
                    price_snapshot: price_snapshot,
                    requires_installation: requires_installation || false
                })
                .select()
                .single();
            itemData = data;
            itemError = error;
        }

        if (itemError) {
            console.error("Error adding item to cart:", itemError);
            return NextResponse.json({ error: itemError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, item: itemData });

    } catch (err) {
        console.error("POST Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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

        if (!vehicle_id) {
            return NextResponse.json({ error: "Missing vehicle_id" }, { status: 400 });
        }

        // 1. Get Active Cart
        const { data: cart } = await supabaseClient
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .eq('vehicle_id', vehicle_id)
            .eq('status', CartStatus.Active)
            .maybeSingle();

        if (!cart) {
            // No active cart, return empty list
            return NextResponse.json({
                success: true,
                items: [],
                pagination: { page, limit, total: 0, hasMore: false }
            });
        }

        // 2. Fetch Cart Items with Product Details
        // We join with the 'products' table using the foreign key relationship
        const { data: items, error, count } = await supabaseClient
            .from('cart_items')
            .select(`
                *,
                product:products(*)
            `, { count: 'exact' })
            .eq('cart_id', cart.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error fetching cart items:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            items,
            pagination: {
                page,
                limit,
                total: count,
                hasMore: count ? (offset + limit) < count : false
            }
        });

    } catch (err) {
        console.error("GET Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}