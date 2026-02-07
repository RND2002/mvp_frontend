import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await backend.post("/cart", body);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        console.error("POST Cart Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!vehicle_id) {
        return NextResponse.json({ error: "Missing vehicle_id" }, { status: 400 });
    }

    try {
        const res = await backend.get(`/cart?vehicle_id=${vehicle_id}&page=${page}&limit=${limit}`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Cart Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
