import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        // Backend expects GET /health/{id}
        const res = await backend.get(`/health/${id}`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Health Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
