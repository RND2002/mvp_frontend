import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; issueId: string }> }
) {
    try {
        const { id, issueId } = await params;
        const body = await request.json();
        const res = await backend.patch(`/vehicles/${id}/issues/${issueId}`, body);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err) {
        console.error("PATCH Vehicle Issue Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
