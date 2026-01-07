import { baseApi } from '../store/api/baseApi';

export interface CreateBookingRequest {
    service_id: string;
    vehicle_id: string;
    service_mode: string;
    scheduled_at?: string;
    price: number;
}

export type BookingStatus = 'requested' | 'garage_assigned' | 'in_progress' | 'completed' | 'cancelled' | 'cancelled_by_user' | 'cancelled_by_garage' | 'work_in_progress' | 'inspection_completed' | 'payment_completed' | 'service_started' | 'garage_accepted';
export type BookingEventType = 'booking_created' | 'garage_assigned' | 'garage_accepted' | 'service_started' | 'inspection_completed' | 'work_in_progress' | 'service_completed' | 'payment_completed' | 'cancelled_by_user' | 'cancelled_by_garage';

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    registration_number: string;
    image_url?: string;
    fuel_type?: string;
    vehicle_type?: string;
}

export interface ServiceItem {
    title: string;
    description?: string;
}

export interface Service {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    service_items?: ServiceItem[];
}

export interface BookingItem {
    id: string;
    booking_id: string;
    title: string;
    is_completed: boolean;
}

export interface BookingEvent {
    id: string;
    booking_id: string;
    event_type: BookingEventType;
    created_at: string;
    meta_data?: any;
}

export interface Garage {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    rating?: number;
}

export interface Booking {
    id: string;
    created_at: string;
    updated_at: string;
    status: BookingStatus;
    estimated_price: number;
    final_price?: number;
    scheduled_at: string;
    customer_id: string;
    vehicle_id: string;
    service_id: string;
    garage_id?: string;
    service_mode: string;
    garage_assigned_at?: string;

    // Relations
    vehicle?: Vehicle;
    service?: Service;
    items?: BookingItem[];
    events?: BookingEvent[];
    garage?: Garage; // Depending on if your API joins 'garages' or similar
    service_center_id?: string; // Sometimes used for garage ID
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation<{ success: boolean; booking: Booking }, CreateBookingRequest>({
            query: (body) => ({
                url: '/booking',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Booking'],
        }),
        getBookings: builder.query<{ success: boolean; bookings: Booking[]; pagination: Pagination }, { vehicle_id: string; page?: number; limit?: number }>({
            query: ({ vehicle_id, page = 1, limit = 10 }) => ({
                url: `/booking?vehicle_id=${vehicle_id}&page=${page}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['Booking'],
        }),
        getBookingById: builder.query<{ success: boolean; booking: Booking }, string>({
            query: (id) => ({
                url: `/booking?id=${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
    }),
});

export const { useCreateBookingMutation, useGetBookingsQuery, useGetBookingByIdQuery } = bookingApi;
