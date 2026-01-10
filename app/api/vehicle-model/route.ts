
import { NextResponse } from "next/server";
import supabase from "@/app/api/supabaseClient";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'brand' or 'model'
    const vehicleType = searchParams.get("vehicle_type");
    const brand = searchParams.get("brand");

    try {
        if (type === 'brand') {
            if (!vehicleType) {
                return NextResponse.json({ error: "vehicle_type is required" }, { status: 400 });
            }

            // Fetch unique brands for the given vehicle_type
            // Note: DB structure might be flat 'vehicle_models' with columns: brand, model, vehicle_type, ...
            // We use .select('brand, logo_url') and .eq('vehicle_type', vehicleType)
            // To get distinct brands, we might need a workaround or RPC if .distinct() isn't straightforward in JS client without specific setup.
            // But usually .select('brand', { head: false }).eq(...).order('brand') and processing in JS or using .select('brand').distinct() if available.
            // Supabase JS doesn't have a direct .distinct() in the builder chain same as SQL, but we can use a modifier or just fetches.
            // Let's try fetching all and deduping in JS for MVP if dataset isn't huge.
            // better: .select('brand, domain', { count: 'exact', head: false })?

            // Actually, let's assume `vehicle_models` table.

            const { data, error } = await supabase
                .from('vehicle_models')
                .select('brand, domain') // Assuming domain is used for logo or we have logo_url
                .eq('vehicle_type', vehicleType)
                .order('brand');

            if (error) throw error;

            // Deduplicate brands
            const uniqueBrands = Array.from(new Set(data.map(item => item.brand)))
                .map(brandName => {
                    const item = data.find(i => i.brand === brandName);
                    return {
                        id: brandName, // Using name as ID if no brand_id table
                        name: brandName,
                        domain: item?.domain
                        // We will handle logoUrl in frontend or here using getBrandLogo util if we move it to shared
                    };
                });

            return NextResponse.json({ success: true, brands: uniqueBrands });

        } else if (type === 'model') {
            if (!brand) {
                return NextResponse.json({ error: "brand is required" }, { status: 400 });
            }

            const { data, error } = await supabase
                .from('vehicle_models')
                .select('id, model, vehicle_type')
                .eq('brand', brand)
                // .eq('vehicle_type', vehicleType) // Optional: if brand is unique to type or if we want to enforce type consistency
                .order('model');

            if (error) throw error;

            // Deduplicate models matching the brand
            const uniqueModelsMap = new Map();
            data.forEach(item => {
                const modelName = item.model.trim();
                if (!uniqueModelsMap.has(modelName.toLowerCase())) {
                    uniqueModelsMap.set(modelName.toLowerCase(), {
                        id: item.id,
                        name: modelName,
                        vehicle_type: item.vehicle_type,
                        brandId: brand
                    });
                }
            });

            const models = Array.from(uniqueModelsMap.values());

            return NextResponse.json({ success: true, models });

        } else {
            return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
        }

    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}
