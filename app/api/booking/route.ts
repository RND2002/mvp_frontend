import { getAuthenticatedUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import { findNearestGarage } from "@/app/lib/garage/assignment";
import { transitionBookingStatus } from "@/app/lib/booking/booking-service-server";

export enum BookingStatus {
    Requested = "requested",
    GarageAssigned = "garage_assigned",
    InProgress = "in_progress",
    Completed = "completed",
    Cancelled = "cancelled",
}

export enum ServiceMode {
    Doorstep = "doorstep",
    PickupDrop = "pickup_drop",
    SelfDrop = "self_drop",
}

export enum BookingEventType {
    BookingCreated = "booking_created",
    GarageAssigned = "garage_assigned",
    GarageAccepted = "garage_accepted",
    ServiceStarted = "service_started",
    InspectionCompleted = "inspection_completed",
    WorkInProgress = "work_in_progress",
    ServiceCompleted = "service_completed",
    PaymentCompleted = "payment_completed",
    CancelledByUser = "cancelled_by_user",
    CancelledByGarage = "cancelled_by_garage",
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Booking Body:", body);
        const { service_id, vehicle_id, service_mode, scheduled_at, price } = body;

        if (!service_id || !vehicle_id || !service_mode) {
            return NextResponse.json(
                { error: "Missing required fields" },
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

        // 1. Create Booking
        const { data: booking, error: bookingError } = await supabaseClient
            .from("bookings")
            .insert({
                customer_id: user.id,
                service_id: service_id,
                vehicle_id: vehicle_id,
                status: BookingStatus.Requested,
                estimated_price: price,
                scheduled_at: scheduled_at || new Date().toISOString(),
                service_mode: service_mode,
            })
            .select()
            .single();

        if (bookingError) {
            console.error("Booking Error:", bookingError);
            return NextResponse.json({ error: bookingError.message }, { status: 500 });
        }

        // 2. Store Booking Items
        // Only proceed if booking created successfully (which is guaranteed if we passed the check above)
        const { data: serviceItems, error: itemsError } = await supabaseClient
            .from("service_items")
            .select("title")
            .eq("service_id", service_id);

        if (!itemsError && serviceItems && serviceItems.length > 0) {
            const bookingItems = serviceItems.map((item: { title: string }) => ({
                booking_id: booking.id,
                title: item.title,
                is_completed: false,
            }));

            const { error: snapshotError } = await supabaseClient
                .from("booking_items")
                .insert(bookingItems);

            if (snapshotError) {
                console.error("Error storing booking items:", snapshotError);
                // We log but do not fail the request as the booking is already created.
            }
        }

        // 3. Log Booking Event
        const { error: eventError } = await supabaseClient
            .from("booking_events")
            .insert({
                booking_id: booking.id,
                event_type: BookingEventType.BookingCreated,
            });

        if (eventError) {
            console.error("Error creating booking event:", eventError);
        }

        // 4. Trigger Garage Assignment (Immediate)
        let assignedGarage = null;
        if (body.userLocation && body.userLocation.lat && body.userLocation.lng && body.userLocation.city) {
            const { lat, lng, city } = body.userLocation;
            console.log("User Location:", { lat, lng, city });

            const nearestGarage = await findNearestGarage(
                supabaseClient,
                lat,
                lng,
                city
            );
            console.log("Nearest Garage:", nearestGarage, booking.id);

            if (nearestGarage) {
                // Assign logic
                const response = await transitionBookingStatus(
                    booking.id,
                    BookingStatus.GarageAssigned,
                    BookingEventType.GarageAssigned,
                    nearestGarage.id,
                    "Auto-assigned based on proximity" //Booking Event description
                );
                console.log("Transition Response:", response);
                assignedGarage = nearestGarage;
            }
        }

        return NextResponse.json(
            {
                success: true,
                booking: { ...booking, garage_id: assignedGarage?.id }, // optimistically return assigned id
                garage: assignedGarage
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Catch Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicle_id = searchParams.get("vehicle_id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    try {
        const { user, supabaseClient, error: authError } = await getAuthenticatedUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        // Case 2: Fetch Bookings List (by Vehicle ID)
        if (vehicle_id) {
            const { data: bookings, error, count } = await supabaseClient
                .from("bookings")
                .select(`
                    *,
                    service:services(name),
                    vehicle:vehicles(registration_number),
                    items:booking_items(*)
                `, { count: 'exact' })
                .eq("vehicle_id", vehicle_id)
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) {
                console.error("Error fetching bookings:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            if (bookings.length > 0) {
                // console.log("First booking items:", JSON.stringify(bookings[0].items, null, 2));
            }
            return NextResponse.json({
                success: true,
                bookings,
                pagination: {
                    page,
                    limit,
                    total: count,
                    totalPages: count ? Math.ceil(count / limit) : 0
                }
            });
        }

        return NextResponse.json({ error: "Missing required parameters (id or vehicle_id)" }, { status: 400 });

    } catch (err) {
        console.error("GET Error:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { booking_id, status, event_type, meta_data, updates } = body;

        if (!booking_id || !status || !event_type) {
            return NextResponse.json(
                { error: "Missing required fields (booking_id, status, event_type)" },
                { status: 400 }
            );
        }

        const { user, error: authError } = await getAuthenticatedUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: authError || "Unauthorized" },
                { status: 401 }
            );
        }

        const updatedBooking = await transitionBookingStatus(
            booking_id,
            status,
            event_type,
            meta_data,
            updates
        );

        return NextResponse.json({ success: true, booking: updatedBooking });
    } catch (err: any) {
        console.error("PATCH Booking Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
