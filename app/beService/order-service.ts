import { baseApi } from "../store/api/baseApi";
import { Product } from "./product-service";

export enum PaymentStatus {
    Pending = 'pending',
    Paid = 'paid',
    Failed = 'failed',
    Refunded = 'refunded'
}

export enum OrderStatus {
    Created = 'created',
    Confirmed = 'confirmed',
    Fulfilled = 'fulfilled',
    Cancelled = 'cancelled'
}

export enum FulfillmentType {
    Delivery = 'delivery',
    Installation = 'installation'
}

export enum FulfillmentStatus {
    Pending = 'pending',
    Scheduled = 'scheduled',
    InProgress = 'in_progress',
    Completed = 'completed',
    Cancelled = 'cancelled'
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    price_snapshot: number;
    quantity: number;
    requires_installation: boolean;
    product?: Product;
}

export interface OrderFulfillment {
    id: string;
    order_id: string;
    fulfillment_type: FulfillmentType;
    status: FulfillmentStatus;
    booking_id?: string;
    tracking_url?: string;
    created_at?: string;
}

export interface Order {
    id: string;
    user_id: string;
    vehicle_id: string;
    created_at: string;
    total_amount: number;
    payment_status: PaymentStatus;
    order_status: OrderStatus;

    // Relations
    order_items?: OrderItem[];
    order_fulfillments?: OrderFulfillment[];
}

export interface Pagination {
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface CheckoutRequest {
    vehicle_id: string;
}

export interface CheckoutResponse {
    success: boolean;
    orderId: string;
}

export interface GetOrdersRequest {
    vehicle_id?: string;
    page?: number;
    limit?: number;
}

export interface GetOrdersResponse {
    success: boolean;
    orders: Order[];
    pagination: Pagination;
}

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
            query: (body) => ({
                url: "/orders/checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: ['Cart', 'Order'],
        }),
        getOrders: builder.query<GetOrdersResponse, GetOrdersRequest>({
            query: ({ vehicle_id, page = 1, limit = 10 }) => {
                let url = `/orders?page=${page}&limit=${limit}`;
                if (vehicle_id) {
                    url += `&vehicle_id=${vehicle_id}`;
                }
                return {
                    url,
                    method: "GET",
                };
            },
            providesTags: ['Order'],
        }),
        getOrderById: builder.query<{ success: true; order: Order }, string>({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
    }),
});

export const { useCheckoutMutation, useGetOrdersQuery, useGetOrderByIdQuery } = orderApi;
