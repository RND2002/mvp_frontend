import { baseApi } from '../store/api/baseApi';
import { Product } from './product-service';
export enum CartStatus {
    Active = 'active',
    Abandoned = 'abandoned',
    CheckedOut = 'checked_out'
}
export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    price_snapshot: number | string;
    requires_installation: boolean;
    product?: Product;
    products?: Product; // Support for singular join returned as 'products'
}

export interface GetCartItemsResponse {
    success: boolean;
    items: CartItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

export interface AddToCartPayload {
    vehicle_id: string;
    product_id: string;
    quantity: number;
    price_snapshot: number;
    requires_installation: boolean;
}

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCartItems: builder.query<GetCartItemsResponse, { vehicle_id: string; page?: number; limit?: number }>({
            query: ({ vehicle_id, page = 1, limit = 10 }) => ({
                url: `/cart-items?vehicle_id=${vehicle_id}&page=${page}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation<{ success: boolean; item: CartItem }, AddToCartPayload>({
            query: (payload) => ({
                url: '/cart-items',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const { useGetCartItemsQuery, useAddToCartMutation } = cartApi;
