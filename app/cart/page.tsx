"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ChevronLeft, ShoppingBag, History } from "lucide-react";

import Container from "@/app/components/common/Container";
import CartItem from "@/app/components/Cart/CartItem";
import OngoingOrdersSheet from "@/app/components/Cart/OngoingOrdersSheet";
import { useGetCartItemsQuery } from "@/app/beService/cart-items-service";
import { useCheckoutMutation, useGetOrdersQuery, FulfillmentType, OrderStatus } from "@/app/beService/order-service";
import { selectSelectedVehicle } from "@/app/store/slices/vehicleSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function CartPage() {
    const router = useRouter();
    const selectedVehicle = useSelector(selectSelectedVehicle);
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [showOngoingOrders, setShowOngoingOrders] = useState(false);

    const { data, isFetching, isLoading } = useGetCartItemsQuery(
        { vehicle_id: selectedVehicle?.id || "", page, limit: 10 },
        { skip: !selectedVehicle }
    );

    const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

    const { data: ordersData } = useGetOrdersQuery(
        { vehicle_id: selectedVehicle?.id, limit: 5 }
    );
    // Filter active delivery orders
    const activeDeliveryOrders = ordersData?.orders.filter(order =>
        order.order_status !== OrderStatus.Cancelled &&
        order.order_fulfillments?.some(f =>
            f.fulfillment_type === FulfillmentType.Delivery &&
            f.status !== 'completed' &&
            f.status !== 'cancelled'
        )
    );

    const handleCheckout = async () => {
        if (!selectedVehicle) return;
        try {
            const res = await checkout({ vehicle_id: selectedVehicle.id }).unwrap();
            if (res.success) {
                toast.success("Order placed successfully!");
                router.push(`/orders/success/${res.orderId}`);
            }
        } catch (err: any) {
            console.error("Checkout Failed", err);
            toast.error(err.data?.error || "Failed to place order");
        }
    };

    // Infinite Scroll Logic: Append new items when page changes
    useEffect(() => {
        if (data?.items) {
            if (page === 1) {
                setAllItems(data.items);
            } else {
                setAllItems((prev) => [...prev, ...data.items]);
            }
        }
    }, [data, page]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            if (data?.pagination?.hasMore && !isFetching) {
                setPage((prev) => prev + 1);
            }
        }
    };

    // Calculate Totals
    const subtotal = allItems.reduce((acc, item) => acc + (item.price_snapshot * item.quantity), 0);
    const totalItems = allItems.reduce((acc, item) => acc + item.quantity, 0);

    if (!selectedVehicle) {
        return (
            <div className="bg-primary-theme min-h-screen pt-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-secondary-theme rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-zinc-500" />
                </div>
                <h2 className="text-white text-xl font-bold mb-2">Select a Vehicle</h2>
                <p className="text-zinc-400 mb-6 max-w-xs">Please select a vehicle from your garage to view your cart.</p>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-2 bg-brand-primary-500 text-white rounded-lg font-medium"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-primary-theme min-h-screen flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-primary-theme/95 backdrop-blur-sm border-b border-secondary-theme">
                <Container className="py-4 px-4">
                    <div className="flex items-center gap-4 w-full">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-white">My Cart</h1>

                        <div className="ml-auto flex items-center gap-4">
                            <span className="text-sm text-zinc-400">
                                {totalItems} items
                            </span>
                            {activeDeliveryOrders && activeDeliveryOrders.length > 0 && (
                                <button
                                    onClick={() => setShowOngoingOrders(true)}
                                    className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <History className="w-6 h-6" />
                                    <span className="absolute top-1 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {activeDeliveryOrders.length}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto"
                onScroll={handleScroll}
            >
                <Container className="py-6 px-4 pb-40 md:pb-48">
                    {allItems.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-secondary-theme rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="w-10 h-10 text-zinc-500" />
                            </div>
                            <h2 className="text-white text-lg font-bold mb-2">Your cart is empty</h2>
                            <p className="text-zinc-500 mb-8 max-w-xs">Looks like you haven't added any gear for your {selectedVehicle.model} yet.</p>
                            <button
                                onClick={() => router.push('/gear-up')}
                                className="px-8 py-3 bg-secondary-theme text-white rounded-xl font-medium hover:bg-secondary-theme/80 transition-colors"
                            >
                                Browse Gear
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {allItems.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}

                            {isFetching && (
                                <div className="py-4 flex justify-center">
                                    <div className="animate-spin text-brand-primary-500">
                                        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Container>
            </div>

            {/* Bottom Summary Bar */}
            {allItems.length > 0 && (
                <div className="sticky bottom-[80px] md:bottom-24 bg-primaryCard border-t md:border-t md:rounded-t-2xl border-secondary-theme p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-40 safe-area-bottom max-w-7xl mx-auto w-full left-0 right-0">
                    <Container className="!py-0 px-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-400">Subtotal</span>
                                <span className="text-white font-bold text-lg">
                                    ₹{subtotal.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <Button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full py-3.5 bg-brand-primary-500 hover:bg-brand-primary-600 text-white font-bold rounded-xl shadow-lg shadow-brand-primary-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isCheckingOut ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Checkout"
                                )}
                            </Button>
                        </div>
                    </Container>
                </div>
            )}

            {/* Ongoing Orders Sheet */}
            <OngoingOrdersSheet
                open={showOngoingOrders}
                setOpen={setShowOngoingOrders}
                orders={activeDeliveryOrders || []}
            />
        </div>
    );
}
