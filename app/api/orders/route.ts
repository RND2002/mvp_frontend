import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    try {
        const { user, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        let url = `/orders?page=${page}&limit=${limit}`;
        if (vehicle_id) {
            url += `&vehicle_id=${vehicle_id}`;
        }

        const res = await backend.get(url);

        if (!res.success) {
            console.error("Error fetching orders:", res.error);
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);

    } catch (err: any) {
        console.error("GET Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}