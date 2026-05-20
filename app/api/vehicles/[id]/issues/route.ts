import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const res = await backend.post(`/vehicles/${id}/issues`, body);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        console.error("POST Vehicle Issue Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
