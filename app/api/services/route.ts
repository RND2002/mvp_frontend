import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export enum VehicleTypes {
    TWO_WHEELER = "two_wheeler",
    THREE_WHEELER = "three_wheeler",
    FOUR_WHEELER = "four_wheeler",
    XUV_SUV = "xuv_suv",
    HEAVY_VEHICLE = "heavy_vehicle",
}

const VALID_VEHICLE_TYPES = Object.values(VehicleTypes);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const vehicleType = searchParams.get("vehicle_type");

        // 1️⃣ Validate vehicle_type
        if (!vehicleType || !VALID_VEHICLE_TYPES.includes(vehicleType as VehicleTypes)) {
            return NextResponse.json(
                { error: "Invalid or missing vehicle_type" },
                { status: 400 }
            );
        }

        // 2️⃣ Auth
        const { user, supabaseClient, error: authError } =
            await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        // 3️⃣ Fetch services supported for this vehicle class
        const { data, error } = await supabaseClient
            .from("services")
            .select(`
        id,
        name,
        category,
        service_pricing!inner (
          base_price,
          vehicle_type
        )
      `)
            .eq("is_active", true)
            .eq("service_pricing.vehicle_type", vehicleType);

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        console.log("Data:", data);


        // 4️⃣ Normalize response for frontend
        const services = data.map((service: any) => ({
            id: service.id,
            name: service.name,
            category: service.category,
            base_price: service.service_pricing[0]?.base_price,
            vehicle_type: service.service_pricing[0]?.vehicle_type,
        }));

        return NextResponse.json(
            { success: true, services },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
