// import { SupabaseClient } from "@supabase/supabase-js";
// import { BookingEventType, BookingStatus } from "@/app/beService/booking-service";

// export interface CreateBookingParams {
//     userId: string;
//     serviceId: string;
//     vehicleId: string;
//     price: number;
//     serviceMode: string;
//     scheduledAt?: string;
// }

// export async function createBookingCore(
//     supabaseClient: SupabaseClient,
//     params: CreateBookingParams
// ) {
//     const { userId, serviceId, vehicleId, price, serviceMode, scheduledAt } = params;

//     // 1. Create Booking
//     const { data: booking, error: bookingError } = await supabaseClient
//         .from("bookings")
//         .insert({
//             customer_id: userId,
//             service_id: serviceId,
//             vehicle_id: vehicleId,
//             status: BookingStatus.Requested,
//             estimated_price: price,
//             scheduled_at: scheduledAt || new Date().toISOString(),
//             service_mode: serviceMode,
//         })
//         .select()
//         .single();

//     if (bookingError) {
//         throw new Error(`Booking Creation Error: ${bookingError.message}`);
//     }

//     // 2. Store Booking Items
//     const { data: serviceItems, error: itemsError } = await supabaseClient
//         .from("service_items")
//         .select("title")
//         .eq("service_id", serviceId);

//     if (!itemsError && serviceItems && serviceItems.length > 0) {
//         const bookingItems = serviceItems.map((item: { title: string }) => ({
//             booking_id: booking.id,
//             title: item.title,
//             is_completed: false,
//         }));

//         const { error: snapshotError } = await supabaseClient
//             .from("booking_items")
//             .insert(bookingItems);

//         if (snapshotError) {
//             console.error("Error storing booking items:", snapshotError);
//         }
//     }

//     // 3. Log Booking Event
//     await supabaseClient
//         .from("booking_events")
//         .insert({
//             booking_id: booking.id,
//             event_type: BookingEventType.BookingCreated,
//         });

//     return booking;
// }
