import { baseApi } from '../store/api/baseApi';

export interface ServiceItem {
    id: string;
    service_id: string;
    title: string;
    description: string;
    sort_order: number;
}

export const serviceItemsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getServiceItems: builder.query<{ success: boolean; serviceItems: ServiceItem[] }, string>({
            query: (serviceId) => ({
                url: `/service-items`,
                method: 'GET',
                params: { service_id: serviceId },
            }),
        }),
    }),
});

export const { useGetServiceItemsQuery } = serviceItemsApi;
