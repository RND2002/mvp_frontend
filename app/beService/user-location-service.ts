import { baseApi } from '../store/api/baseApi';

export interface UserLocation {
    id: string;
    label?: string;
    address?: string;
    city?: string;
    delivery_address?: string;
    latitude: number;
    longitude: number;
    is_default?: boolean;
    created_at: string;
}

export interface CreateLocationRequest {
    label?: string;
    address?: string;
    city?: string;
    delivery_address?: string;
    latitude: number;
    longitude: number;
    is_default?: boolean;
}

export const userLocationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserLocations: builder.query<{ success: boolean; data?: UserLocation[]; locations?: UserLocation[] }, void>({
            query: () => ({
                url: '/user-locations',
                method: 'GET',
            }),
            providesTags: ['Location'],
        }),
        createUserLocation: builder.mutation<{ success: boolean; data: UserLocation }, CreateLocationRequest>({
            query: (body) => ({
                url: '/user-locations',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Location'],
        }),
        updateUserLocation: builder.mutation<{ success: boolean; data: UserLocation }, Partial<CreateLocationRequest> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/user-locations/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Location'],
        }),
        deleteUserLocation: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/user-locations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Location'],
        }),
    }),
});

export const {
    useGetUserLocationsQuery,
    useCreateUserLocationMutation,
    useUpdateUserLocationMutation,
    useDeleteUserLocationMutation,
} = userLocationApi;
