import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const res = await backend.get(`/orders/${id}`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 404 });
        }

        return NextResponse.json(res);
    } catch (err: any) {
        console.error("GET Order Detail Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
