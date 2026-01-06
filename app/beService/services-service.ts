import { baseApi } from '../store/api/baseApi';

export interface Service {
    id: string;
    name: string;
    category: string;
    base_price: number;
    description?: string;
    is_active: boolean;
}

export const serviceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getServices: builder.query<{ success: boolean; services: Service[] }, { vehicle_type: string }>({
            query: (params) => ({
                url: `/services`,
                method: 'GET',
                params: { vehicle_type: params.vehicle_type },
            }),
        }),
    }),
});

export const { useGetServicesQuery } = serviceApi;
