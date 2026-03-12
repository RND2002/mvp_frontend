"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Truck, Wrench, ArrowRight, Package, Calculator, MapPin, ReceiptText } from "lucide-react";
import Container from "@/app/components/common/Container";
import { useGetOrderByIdQuery, FulfillmentType } from "@/app/beService/order-service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";

export default function OrderSuccessPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const { data, isLoading } = useGetOrderByIdQuery(orderId);

    const order = data?.order;
    const deliveryFulfillment = order?.order_fulfillments?.find(f => f.fulfillment_type === FulfillmentType.Delivery);
    const installationFulfillment = order?.order_fulfillments?.find(f => f.fulfillment_type === FulfillmentType.Installation);

    if (!isLoading && !order) {
        return (
            <div className="min-h-screen bg-primary-theme flex items-center justify-center text-white font-black uppercase tracking-widest text-[10px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                        <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    Order not found
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-theme flex items-center justify-center">
                <Loader size="lg" text="Verifying Order..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-theme py-12 px-4 pb-32">
            <Container>
                <div className="max-w-2xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-theme-green/20 blur-3xl rounded-full"></div>
                            <div className="relative w-24 h-24 bg-theme-green/10 rounded-[2.5rem] flex items-center justify-center border border-theme-green/20">
                                <CheckCircle2 className="w-12 h-12 text-theme-green" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 uppercase tracking-tighter italic">
                            Order Confirmed!
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">Transaction ID</span>
                            <span className="text-white font-bold font-mono text-xs bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                #{orderId.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Fulfillment Status Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Delivery Card */}
                            {deliveryFulfillment && (
                                <div className="bg-primaryCard/40 border border-primaryBorder/20 rounded-[2.5rem] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-12 -mt-12"></div>
                                    <div className="flex flex-col gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                            <Truck className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight italic">Shipment</h3>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Fast dispatch in progress. tracking becomes active once shipped.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Installation Card */}
                            {installationFulfillment && (
                                <div className="bg-primaryCard/40 border border-primaryBorder/20 rounded-[2.5rem] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-theme-green/5 blur-2xl rounded-full -mr-12 -mt-12"></div>
                                    <div className="flex flex-col gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-theme-green/10 rounded-2xl flex items-center justify-center border border-theme-green/20">
                                            <Wrench className="w-6 h-6 text-theme-green" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight italic">Installation</h3>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Pro technician assignment pending. Check your bookings tab.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Details Accordion-like Section */}
                        <div className="bg-primaryCard/40 border border-primaryBorder/20 rounded-[2.5rem] p-8 overflow-hidden relative">
                            <div className="flex items-center gap-3 mb-8">
                                <ReceiptText className="w-4 h-4 text-theme-green" />
                                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Order Snapshot</h3>
                            </div>

                            <div className="space-y-6">
                                {order?.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl overflow-hidden border border-white/5 relative shrink-0">
                                                <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent"></div>
                                                <Package className="w-6 h-6 text-gray-700 absolute inset-0 m-auto opacity-20" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-black text-xs uppercase tracking-tight line-clamp-1 group-hover:text-theme-green transition-colors italic">
                                                    {item.product_name || 'Premium Item'}
                                                </p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-white font-black text-sm tracking-tighter shrink-0">₹{item.price_snapshot}</span>
                                    </div>
                                ))}

                                <div className="h-px bg-white/5 my-6"></div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Calculator className="w-4 h-4 text-gray-600" />
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Final Amount</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="text-3xl font-black text-theme-green tracking-tighter">₹{order?.total_amount}</div>
                                        <span className="text-[8px] font-medium text-gray-600 uppercase tracking-tighter">Securely Managed by Vroom Pay</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => router.push('/service-history')}
                                className="h-14 bg-white/5 border border-white/10 text-white rounded-3xl text-sm font-semibold hover:bg-white/10 transition-all active:scale-95"
                            >
                                Track Service
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="h-14 bg-theme-green text-black rounded-3xl text-sm font-semibold hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(0,223,130,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Back To Home <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
