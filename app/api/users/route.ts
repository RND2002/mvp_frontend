import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const res = await backend.post("/users", body);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (error) {
        console.error("POST Users Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
