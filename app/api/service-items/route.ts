import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get("service_id");

        if (!serviceId) {
            return NextResponse.json(
                { error: "Missing service_id" },
                { status: 400 }
            );
        }

        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        const { data, error } = await supabaseClient
            .from("service_items")
            .select("*")
            .eq("service_id", serviceId)
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, serviceItems: data },
            { status: 200 }
        );
    } catch (err) {
        console.error("Catch Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
