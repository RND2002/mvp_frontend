import { NextResponse } from "next/server";
import { findNearestGarage } from "@/app/lib/garage/assignment";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { BookingStatus, BookingEventType } from "@/app/api/booking/route";

export async function POST(request: Request) {
    try {
        const { userLat, userLng, city, bookingId } = await request.json();


        if (!userLat || !userLng || !city) {
            return NextResponse.json(
                { error: "Missing location data (lat, lng, city)" },
                { status: 400 }
            );
        }

        // Optional: Auth check
        const { supabaseClient } = await getAuthenticatedUser();
        // We might allow system calls (cron) later without user session? 
        // For now, if called from frontend, user likely exists.

        const nearestGarage = await findNearestGarage(
            supabaseClient,
            userLat,
            userLng,
            city
        );

        if (!nearestGarage) {
            return NextResponse.json(
                { success: false, message: "No available garages found in this city." },
                { status: 404 }
            );
        }

        // If bookingId is provided, perform the actual assignment in DB
        // i.e., update booking with garage_id using the robust service
        if (bookingId) {
            const { transitionBookingStatus } = await import("@/app/lib/booking/booking-service-server");

            await transitionBookingStatus(
                bookingId,
                BookingStatus.GarageAssigned,
                BookingEventType.GarageAssigned,
                nearestGarage.id,
                "Auto-assigned based on proximity" //Booking Event description
            );
        }

        return NextResponse.json({
            success: true,
            assigned: true,
            garage: nearestGarage
        });

    } catch (err: any) {
        console.error("Assignment API Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}