import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleType = searchParams.get("vehicle_type");

        if (!vehicleType) {
            return NextResponse.json({ error: "Missing vehicle_type" }, { status: 400 });
        }

        const res = await backend.get(`/vehicle-services?vehicle_type=${vehicleType}`);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        // Backend returns services in the format we need or close to it.
        // If normalization is needed, we do it here. 
        // Based on backend routes, it returns { success, services }
        return NextResponse.json(res);
    } catch (err) {
        console.error("GET Services Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
