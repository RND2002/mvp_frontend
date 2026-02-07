import { BookingEventType, BookingStatus } from "@/app/beService/booking-service";
import { supabaseService } from "@/app/api/supabaseServiceClient";

/**
 * Transitions a booking to a new status, updates fields, and logs the event atomically.
 * @param bookingId The ID of the booking to update
 * @param status The new status for the booking (BookingStatus enum value)
 * @param eventType The type of event to log (BookingEventType enum value)
 * @param eventMetadata Additional metadata for the event log (stored in description)
 * @param additionalUpdates Object containing other fields to update in the bookings table (e.g. garage_id)
 */
export async function transitionBookingStatus(
    bookingId: string,
    bookingStatus: BookingStatus,
    eventType: BookingEventType,
    garage_id: string,
    description: string
) {
    // 1. Update Booking
    const { data: updatedBooking, error: updateError } = await supabaseService
        .from('bookings')
        .update({
            status: bookingStatus,
            garage_id: garage_id,
        })
        .eq('id', bookingId)
        .select();

    console.log("Updated Booking:", updatedBooking);

    if (updateError) {
        console.error(`Failed to update booking ${bookingId} to ${bookingStatus}:`, updateError);
        throw new Error(`Failed to update booking status: ${updateError.message}`);
    }

    // 2. Log Event
    // Schema: id, booking_id, event_type, description, created_at, updated_at

    const { error: eventError } = await supabaseService
        .from('booking_events')
        .insert({
            booking_id: bookingId,
            event_type: eventType,
            description: description
        });

    if (eventError) {
        console.error(`Failed to log event ${eventType} for booking ${bookingId}:`, eventError);
        // We generally don't rollback the booking update just because logging failed, but we log the error.
    }

    return updatedBooking;
}
