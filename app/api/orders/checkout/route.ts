import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { PaymentStatus, OrderStatus, FulfillmentType, FulfillmentStatus } from "@/app/beService/order-service";
import { createBookingCore } from "@/app/lib/booking-core";
import { BookingStatus, ServiceMode } from "@/app/api/booking/route";
import { CartStatus } from "@/app/beService/cart-items-service";

// Provided Installation Service ID
const INSTALLATION_SERVICE_ID = "562f30d0-6cae-47d6-9138-13eea8e96fc9";

export async function POST(request: Request) {
    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();
        const body = await request.json();
        const { vehicle_id } = body;

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!vehicle_id) {
            return NextResponse.json({ error: "Missing vehicle_id" }, { status: 400 });
        }

        // 1. Fetch Active Cart
        const { data: cartItems, error: cartError } = await supabaseClient
            .from("cart_items")
            .select(`
                *,
                product:products(*)
            `)
            .eq("cart.user_id", user.id)
            .eq("cart.vehicle_id", vehicle_id)
            .eq("cart.status", CartStatus.Active)
            .not("cart", "is", null);

        // Note: The above query relies on implicit join on cart_id if cart_items has FK. 
        // More robust approach: Find active cart first.
        const { data: activeCart } = await supabaseClient
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .eq("vehicle_id", vehicle_id)
            .eq("status", CartStatus.Active)
            .single();

        if (!activeCart) {
            return NextResponse.json({ error: "No active cart found" }, { status: 404 });
        }

        const { data: items } = await supabaseClient
            .from("cart_items")
            .select(`
                *,
                product:products(*)
            `)
            .eq("cart_id", activeCart.id);

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 2. Calculate Total
        const totalAmount = items.reduce((acc, item) => {
            return acc + (item.price_snapshot * item.quantity);
        }, 0);

        // 3. Create Order
        const { data: order, error: orderError } = await supabaseClient
            .from("orders")
            .insert({
                user_id: user.id,
                vehicle_id: vehicle_id,
                total_amount: totalAmount,
                payment_status: PaymentStatus.Pending,
                order_status: OrderStatus.Created,
            })
            .select()
            .single();

        if (orderError) {
            throw new Error(`Order Creation Failed: ${orderError.message}`);
        }

        // 4. Create Order Items
        const orderItemsData = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product.name,
            price_snapshot: item.price_snapshot,
            quantity: item.quantity,
            requires_installation: item.requires_installation
        }));

        const { error: itemsInsertError } = await supabaseClient
            .from("order_items")
            .insert(orderItemsData);

        if (itemsInsertError) {
            throw new Error(`Order Items Creation Failed: ${itemsInsertError.message}`);
        }

        // 5. Fulfillment Logic
        // Group items by requirement
        const installationItems = items.filter((i: any) => i.requires_installation);
        const deliveryItems = items.filter((i: any) => !i.requires_installation);

        // 5a. Handle Installation Fulfillments
        if (installationItems.length > 0) {
            // Logic: Create one booking for all installation items? 
            // Or one per item? Usually one booking per "checkout" is cleaner if they go to the same garage.
            // Assumption: Single booking for this batch.

            // Note: We need a 'scheduled_at'. For now, defaulting to next day or explicitly null (pending).
            // The prompt says "Create booking using existing booking API". 
            // We'll use createBookingCore.

            // Is price of booking just the service cost? Or sum of items? 
            // Usually booking price = service charge. Items are paid in order.
            // Let's assume booking 'price' is 0 or a base fee (fetched from service). 
            // For now, passing 0 as estimated_service_cost, as items are paid in order.

            const booking = await createBookingCore(supabaseClient, {
                userId: user.id,
                serviceId: INSTALLATION_SERVICE_ID,
                vehicleId: vehicle_id,
                price: 0, // Service cost separate?
                serviceMode: ServiceMode.SelfDrop, // Default for installation
            });

            await supabaseClient.from("order_fulfillments").insert({
                order_id: order.id,
                fulfillment_type: FulfillmentType.Installation,
                status: FulfillmentStatus.Pending,
                booking_id: booking.id
            });
        }

        // 5b. Handle Delivery Fulfillments
        if (deliveryItems.length > 0) {
            await supabaseClient.from("order_fulfillments").insert({
                order_id: order.id,
                fulfillment_type: FulfillmentType.Delivery,
                status: FulfillmentStatus.Pending,
                // No booking_id
            });
        }

        // 6. Close Cart
        const response = await supabaseClient
            .from("carts")
            .update({ status: CartStatus.CheckedOut })
            .eq("id", activeCart.id);
        console.log("Cart Closed:", response);

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (err: any) {
        console.error("Checkout Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
