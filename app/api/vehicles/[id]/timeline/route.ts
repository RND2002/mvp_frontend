import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const res = await backend.get(`/vehicles/${id}/timeline`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Vehicle Timeline Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
