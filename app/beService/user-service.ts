import { baseApi } from '../store/api/baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserVehicles: builder.query<{
            vehicles: {
                id: string;
                type: 'car' | 'bike';
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