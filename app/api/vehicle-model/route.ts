import { NextResponse } from "next/server";
import { backend } from "@/app/lib/backend-client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'brand' or 'model'
    const vehicleType = searchParams.get("vehicle_type");
    const brand = searchParams.get("brand");

    try {
        let url = `/vehicle-models?type=${type}`;
        if (vehicleType) url += `&vehicle_type=${vehicleType}`;
        if (brand) url += `&brand=${brand}`;

        const res = await backend.get(url);

        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status || 500 });
        }

        return NextResponse.json(res);
    } catch (err: any) {
        console.error("GET Vehicle Models Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
