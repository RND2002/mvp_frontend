import { baseApi } from '../store/api/baseApi';

export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_urls: string[];
    requires_installation: boolean;
}

export interface Pagination {
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface GetRecommendationsResponse {
    success: boolean;
    products: Product[];
    pagination: Pagination;
}

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRecommendations: builder.query<GetRecommendationsResponse, { vehicle_id: string; page?: number; limit?: number; category?: string }>({
            query: ({ vehicle_id, page = 1, limit = 10, category }) => ({
                url: `/product-recommendations?vehicle_id=${vehicle_id}&page=${page}&limit=${limit}&category=${category || ''}`,
                method: 'GET',
            }),
            providesTags: ['Product'],
        }),
    }),
});

export const { useGetRecommendationsQuery } = productApi;
