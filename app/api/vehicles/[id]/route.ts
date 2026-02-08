import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Backend expects PATCH /vehicle/{id}
        const res = await backend.patch(`/vehicles/${id}`, body);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("PATCH Vehicle Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Backend expects GET /vehicle/{id}
        const res = await backend.get(`/vehicle/${id}`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Vehicle Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
