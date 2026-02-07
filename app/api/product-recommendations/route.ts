import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const category = searchParams.get("category");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const id = searchParams.get("id");

    try {
        if (id) {
            const res = await backend.get(`/products/${id}`);
            if (!res.success) {
                return NextResponse.json({ error: res.error }, { status: res.status || 500 });
            }
            return NextResponse.json(res);
        }

        if (vehicle_id) {
            let url = `/products/recommendations?vehicle_id=${vehicle_id}&page=${page}&limit=${limit}`;
            if (category) url += `&category=${category}`;

            const res = await backend.get(url);
            if (!res.success) {
                return NextResponse.json({ error: res.error }, { status: res.status || 500 });
            }
            return NextResponse.json(res);
        }

        return NextResponse.json({ error: "Missing required parameters (id or vehicle_id)" }, { status: 400 });

    } catch (err) {
        console.error("GET Product Recommendations Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
