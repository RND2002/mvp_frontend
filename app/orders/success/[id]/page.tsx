"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Truck, Wrench, ArrowRight } from "lucide-react";
import Container from "@/app/components/common/Container";
import { useGetOrderByIdQuery, FulfillmentType } from "@/app/beService/order-service";

export default function OrderSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const { data, isLoading } = useGetOrderByIdQuery(orderId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-theme flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-brand-primary-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!data?.order) {
        return (
            <div className="min-h-screen bg-primary-theme flex items-center justify-center text-white">
                Order not found
            </div>
        );
    }

    const { order } = data;
    const deliveryFulfillment = order.order_fulfillments?.find(f => f.fulfillment_type === FulfillmentType.Delivery);
    const installationFulfillment = order.order_fulfillments?.find(f => f.fulfillment_type === FulfillmentType.Installation);

    return (
        <div className="min-h-screen bg-primary-theme py-12 px-4">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
                        <p className="text-zinc-400">Order ID: #{orderId.slice(0, 8).toUpperCase()}</p>
                    </div>

                    <div className="space-y-6">
                        {/* Delivery Message */}
                        {deliveryFulfillment && (
                            <div className="bg-primaryCard border border-secondary-theme rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg">
                                        <Truck className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Delivery Confirmed 🚀</h3>
                                        <p className="text-zinc-400 text-sm">
                                            We'll notify you once your items are shipped. You can track this in your orders.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Installation Message */}
                        {installationFulfillment && (
                            <div className="bg-primaryCard border border-secondary-theme rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-brand-primary-500/10 rounded-lg">
                                        <Wrench className="w-6 h-6 text-brand-primary-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Installation Scheduled 🛠</h3>
                                        <p className="text-zinc-400 text-sm mb-4">
                                            Our technician will arrive soon. Please check your bookings for details.
                                        </p>
                                        <div className="p-4 bg-black/20 rounded-lg space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-500">Service Status</span>
                                                <span className="text-brand-primary-500 font-medium">Pending Confirmation</span>
                                            </div>
                                            {/* Note: In a real app, we'd show the booking schedule here if available */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Summary */}
                        <div className="bg-primaryCard border border-secondary-theme rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                            <div className="space-y-4">
                                {order.order_items?.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-secondary-theme rounded-lg overflow-hidden flex-shrink-0">
                                                {/* Image placeholder would go here */}
                                                <div className="w-full h-full bg-zinc-800" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">{item.product_name || 'Product'}</p>
                                                <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-white font-medium">₹{item.price_snapshot}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-secondary-theme my-4" />
                                <div className="flex justify-between items-center text-lg font-bold text-white">
                                    <span>Total</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => router.push('/bookings/history')}
                                className="px-6 py-3 bg-secondary-theme text-white rounded-xl font-medium hover:bg-secondary-theme/80 transition-colors"
                            >
                                Track Bookings
                            </button>
                            <button
                                onClick={() => router.push('/cart')}
                                className="px-6 py-3 bg-brand-primary-500 text-white rounded-xl font-medium hover:bg-brand-primary-600 transition-colors flex items-center justify-center gap-2"
                            >
                                Go to Cart <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
