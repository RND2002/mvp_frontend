import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { vehicle_id, location_id, delivery_address, userLocation } = body;

        if (!vehicle_id || !location_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const res = await backend.post("/orders/checkout", {
            vehicle_id,
            location_id,
            delivery_address,
            userLocation
        });

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err: any) {
        console.error("Checkout Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
