import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { user, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        const res = await backend.get(`/bookings/${id}`);

        if (!res.success) {
            console.error("Error fetching booking:", res.error);
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);

    } catch (err) {
        console.error("GET Booking By ID Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
