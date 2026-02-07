import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get("service_id");

        if (!serviceId) {
            return NextResponse.json({ error: "Missing service_id" }, { status: 400 });
        }

        const res = await backend.get(`/services/${serviceId}/items`);
        // console.log(res);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Service Items Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
