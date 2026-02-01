import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userLat, userLng, city, bookingId } = body;

        if (!userLat || !userLng || !city) {
            return NextResponse.json({ error: "Missing location data" }, { status: 400 });
        }

        const res = await backend.post("/garages/assign", {
            lat: userLat,
            lng: userLng,
            city,
            bookingId
        });

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err: any) {
        console.error("Assignment API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
