"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ShoppingBag, History, ArrowRight } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/app/components/common/PageHeader";

import Container from "@/app/components/common/Container";
import CartItem from "@/app/components/Cart/CartItem";
import OngoingOrdersSheet from "@/app/components/Cart/OngoingOrdersSheet";
import { useGetCartItemsQuery } from "@/app/beService/cart-items-service";
import { useCheckoutMutation, useGetOrdersQuery, FulfillmentType, OrderStatus } from "@/app/beService/order-service";
import { selectSelectedVehicle } from "@/app/store/slices/vehicleSlice";
import { selectLocation } from "@/app/store/slices/locationSlice";
import { LocationSelector } from "@/app/components/Location/LocationSelector";
import { UserLocation } from "@/app/beService/user-location-service";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function CartPage() {
    const router = useRouter();
    const selectedVehicle = useSelector(selectSelectedVehicle);
    const { lat, lng, city } = useSelector(selectLocation);
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState<any[]>([]);
    const [showOngoingOrders, setShowOngoingOrders] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);


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
        if (!selectedVehicle || !selectedLocation) {
            toast.error("Please select a delivery location first");
            return;
        }
        try {
            const res = await checkout({
                vehicle_id: selectedVehicle.id,
                location_id: selectedLocation.id,
                delivery_address: selectedLocation.address || "",
                userLocation: (lat && lng && city) ? { lat, lng, city } : undefined
            }).unwrap();

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
    const subtotal = allItems.reduce((acc, item) => {
        const price = typeof item.price_snapshot === 'string' ? parseFloat(item.price_snapshot) : item.price_snapshot;
        return acc + (price * item.quantity);
    }, 0);
    const totalItems = allItems.reduce((acc, item) => acc + item.quantity, 0);

    if (!selectedVehicle) {
        return (
            <div className="bg-[#F8F9FB] min-h-screen pt-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-[#F5EDFC] rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-zinc-500" />
                </div>
                <h2 className="text-[#0F172A] text-xl font-bold mb-2">Select a Vehicle</h2>
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
        <div className="bg-[#F8F9FB] h-svh flex flex-col overflow-x-hidden">
            <Container className="pt-8 pb-4 px-4 sticky top-0 bg-primary-theme/80 backdrop-blur-md z-30">
                {/* Standardized Premium Page Header */}
                <PageHeader
                    title={<>My <span className="text-theme-green">Cart</span></>}
                    subtitle={`You have ${totalItems} items ready.`}
                    backUrl="/dashboard"
                    rightElement={(
                        <div className="flex items-center gap-3">
                            {/* History Button */}
                            {activeDeliveryOrders && activeDeliveryOrders.length > 0 && (
                                <button
                                    onClick={() => setShowOngoingOrders(true)}
                                    className="relative p-2.5 bg-[#F8F9FB] border border-[#E4E7EC] rounded-xl text-zinc-400 hover:text-white transition-all active:scale-95 group"
                                >
                                    <History className="w-5 h-5 group-hover:rotate-[-20deg] transition-transform" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-primary-theme">
                                        {activeDeliveryOrders.length}
                                    </span>
                                </button>
                            )}

                            {/* Slim Checkout Button at Top */}
                            {allItems.length > 0 && (
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut || !selectedLocation}
                                    className={cn(
                                        "h-11 px-6 relative group overflow-hidden transition-all duration-500 font-bold text-sm rounded-xl flex items-center justify-center gap-2",
                                        !selectedLocation || isCheckingOut
                                            ? "bg-[#F8F9FB] text-[#94A3B8] border border-[#E4E7EC] cursor-not-allowed"
                                            : "bg-theme-green text-white shadow-[0_10px_20px_-5px_rgba(107,47,160,0.3)] active:scale-95"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                    <span className="relative z-10 shrink-0">
                                        Checkout ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-1 hidden md:block" />
                                </Button>
                            )}
                        </div>
                    )}
                />
            </Container>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto scrollbar-hide px-4"
                onScroll={handleScroll}
            >
                <Container className="py-6 pb-24 md:pb-32 p-0!">
                    {/* Location Selector Move to Top of List */}
                    {allItems.length > 0 && (
                        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <div className="w-1 h-3 bg-theme-green rounded-full"></div>
                                <span className="text-[9px] font-black text-[#475569] uppercase tracking-[0.2em]">Service Location</span>
                            </div>
                            <LocationSelector
                                onLocationSelect={setSelectedLocation}
                                selectedLocationId={selectedLocation?.id}
                            />
                        </div>
                    )}

                    {allItems.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-[#F5EDFC] rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="w-10 h-10 text-zinc-500" />
                            </div>
                            <h2 className="text-[#0F172A] text-lg font-bold mb-2">Your cart is empty</h2>
                            <p className="text-zinc-500 mb-8 max-w-xs">Looks like you haven't added any gear for your {selectedVehicle.model} yet.</p>
                            <button
                                onClick={() => router.push('/gear-up')}
                                className="px-8 py-3 bg-[#F5EDFC] rounded-xl font-medium hover:bg-[#F5EDFC]/80 transition-colors"
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
                                <div className="py-8 flex justify-center">
                                    <Loader size="md" text="Updating Cart..." />
                                </div>
                            )}
                        </div>
                    )}
                </Container>
            </div>


            {/* Ongoing Orders Sheet */}
            <OngoingOrdersSheet
                open={showOngoingOrders}
                setOpen={setShowOngoingOrders}
                orders={activeDeliveryOrders || []}
            />
        </div>
    );
}
