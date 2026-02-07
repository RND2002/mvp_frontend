import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await backend.post("/bookings", body);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        console.error("POST Booking Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!vehicle_id) {
        return NextResponse.json({ error: "Missing required parameter: vehicle_id" }, { status: 400 });
    }

    try {
        const res = await backend.get(`/bookings?vehicle_id=${vehicle_id}&page=${page}&limit=${limit}`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Bookings Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { booking_id, status, event_type, description } = body;

        if (!booking_id) {
            return NextResponse.json({ error: "Missing required field: booking_id" }, { status: 400 });
        }

        const res = await backend.patch(`/bookings/${booking_id}/status`, {
            status,
            eventType: event_type,
            description
        });

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err: any) {
        console.error("PATCH Booking Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
