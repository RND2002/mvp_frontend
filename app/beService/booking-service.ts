import { baseApi } from '../store/api/baseApi';

export interface CreateBookingRequest {
    service_id: string;
    vehicle_id: string;
    service_mode: string;
    scheduled_at?: string;
    price: number;
    delivery_address?: string;
    userLocation?: {
        lat: number;
        lng: number;
        city: string;
    };
}

export enum BookingStatus {
    Requested = 'requested',
    GarageAssigned = 'garage_assigned',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled',
    CancelledByUser = 'cancelled_by_user',
    CancelledByGarage = 'cancelled_by_garage',
    WorkInProgress = 'work_in_progress',
    InspectionCompleted = 'inspection_completed',
    PaymentCompleted = 'payment_completed',
    ServiceStarted = 'service_started',
    GarageAccepted = 'garage_accepted'
}

export enum BookingEventType {
    BookingCreated = 'booking_created',
    GarageAssigned = 'garage_assigned',
    GarageAccepted = 'garage_accepted',
    ServiceStarted = 'service_started',
    InspectionCompleted = 'inspection_completed',
    WorkInProgress = 'work_in_progress',
    ServiceCompleted = 'service_completed',
    PaymentCompleted = 'payment_completed',
    CancelledByUser = 'cancelled_by_user',
    CancelledByGarage = 'cancelled_by_garage'
}

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
    meta_data?: Record<string, unknown>;
}

export interface Garage {
    id: string;
    name: string;
    address?: string;
    contact?: string;
    rating?: string | number;
    location?: string;
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
    vehicles?: Vehicle;
    service?: Service;
    booking_items?: BookingItem[];
    booking_events?: BookingEvent[];
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
                url: `/booking/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
        updateBookingStatus: builder.mutation<{ success: boolean; booking: Booking }, {
            booking_id: string;
            status: BookingStatus;
            eventType?: BookingEventType;
            event_type?: BookingEventType;
            curr_odometre_reading?: number;
            final_price?: number;
            components_serviced?: string[];
            service_type?: string;
            notes?: string;
            meta_data?: Record<string, unknown>;
            updates?: Record<string, unknown>;
        }>({
            query: (body) => ({
                url: '/booking',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { booking_id }) => ['Booking', { type: 'Booking', id: booking_id }],
        }),
    }),
});

export const { useCreateBookingMutation, useGetBookingsQuery, useGetBookingByIdQuery, useUpdateBookingStatusMutation } = bookingApi;
