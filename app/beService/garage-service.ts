import { baseApi } from '../store/api/baseApi';
import { Garage } from '../lib/garage/assignment';

export interface AssignGaragePayload {
    userLat: number;
    userLng: number;
    city: string;
    bookingId?: string; // Optional: if we want to update a booking directly
}

export interface AssignGarageResponse {
    success: boolean;
    assigned: boolean;
    garage: Garage;
    message?: string;
    error?: string;
}

export const garageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        assignGarage: builder.mutation<AssignGarageResponse, AssignGaragePayload>({
            query: (payload) => ({
                url: '/garage/assign',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const { useAssignGarageMutation } = garageApi;
