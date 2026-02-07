// import { VehicleTypes } from '../api/services/route';
import { baseApi } from '../store/api/baseApi';
import { VEHICLE_TYPE } from './vehicle-service';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserVehicles: builder.query<{
            vehicles: {
                id: string;
                vehicle_type: VEHICLE_TYPE;
                brand: string;
                model: string;
                year: number;
                fuel_type: string;
                registration_number?: string;
                created_at: string;
            }[]
        }, void>({
            query: () => ({
                url: '/users/me/vehicle',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        syncUser: builder.mutation<{ success: boolean; error?: string }, { id: string; email?: string; phone?: string }>({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetUserVehiclesQuery, useSyncUserMutation } = userApi;