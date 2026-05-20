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
            <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-[#0F172A] font-black uppercase tracking-widest text-[10px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-[#F5EDFC] rounded-full flex items-center justify-center border border-[#E4E7EC]">
                    <Package className="w-5 h-5 text-[#94A3B8]" />
                </div>
                Order not found
            </div>
        </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
            <Loader size="lg" text="Verifying Order..." />
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 pb-32">
            <Container>
                <div className="max-w-2xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-[#6B2FA0]/10 blur-3xl rounded-full"></div>
                            <div className="relative w-24 h-24 bg-[#6B2FA0]/10 rounded-[2.5rem] flex items-center justify-center border border-[#6B2FA0]/20">
                                <CheckCircle2 className="w-12 h-12 text-[#6B2FA0]" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-3 uppercase tracking-tighter italic">
                            Order Confirmed!
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-[#475569] font-black uppercase text-[10px] tracking-[0.2em]">Transaction ID</span>
                            <span className="text-[#0F172A] font-bold font-mono text-xs bg-[#F5EDFC] px-2 py-0.5 rounded border border-[#E4E7EC]">
                                #{orderId.slice(0, 8).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Fulfillment Status Cards */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Delivery Card */}
                            {deliveryFulfillment && (
                                <div className="bg-white border border-[#E4E7EC] rounded-[2.5rem] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-12 -mt-12"></div>
                                    <div className="flex flex-col gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                            <Truck className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-[#0F172A] mb-1 uppercase tracking-tight italic">Shipment</h3>
                                            <p className="text-[#475569] text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Fast dispatch in progress. tracking becomes active once shipped.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Installation Card */}
                            {installationFulfillment && (
                                <div className="bg-white border border-[#E4E7EC] rounded-[2.5rem] p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#6B2FA0]/5 blur-2xl rounded-full -mr-12 -mt-12"></div>
                                    <div className="flex flex-col gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-[#6B2FA0]/10 rounded-2xl flex items-center justify-center border border-[#6B2FA0]/20">
                                            <Wrench className="w-6 h-6 text-[#6B2FA0]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-[#0F172A] mb-1 uppercase tracking-tight italic">Installation</h3>
                                            <p className="text-[#475569] text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                                Pro technician assignment pending. Check your bookings tab.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Details Accordion-like Section */}
                        <div className="bg-white border border-[#E4E7EC] rounded-[2.5rem] p-8 overflow-hidden relative">
                            <div className="flex items-center gap-3 mb-8">
                                <ReceiptText className="w-4 h-4 text-[#6B2FA0]" />
                                <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-[0.2em]">Order Snapshot</h3>
                            </div>

                            <div className="space-y-6">
                                {order?.order_items?.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-[#F8F9FB] rounded-2xl overflow-hidden border border-[#E4E7EC] relative shrink-0">
                                                <Package className="w-6 h-6 text-[#94A3B8] absolute inset-0 m-auto opacity-40" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[#0F172A] font-black text-xs uppercase tracking-tight line-clamp-1 group-hover:text-[#6B2FA0] transition-colors italic">
                                                    {item.product_name || 'Premium Item'}
                                                </p>
                                                <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-[#0F172A] font-black text-sm tracking-tighter shrink-0">₹{item.price_snapshot}</span>
                                    </div>
                                ))}

                                <div className="h-px bg-[#E4E7EC] my-6"></div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Calculator className="w-4 h-4 text-[#94A3B8]" />
                                        <span className="text-[9px] font-black text-[#475569] uppercase tracking-widest">Final Amount</span>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="text-3xl font-black text-[#6B2FA0] tracking-tighter">₹{order?.total_amount}</div>
                                        <span className="text-[8px] font-medium text-[#94A3B8] uppercase tracking-tighter">Securely Managed by Vroom Pay</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <button
                                onClick={() => router.push('/service-history')}
                                className="h-14 bg-white border border-[#E4E7EC] text-[#0F172A] rounded-3xl text-sm font-semibold hover:bg-[#F8F9FB] transition-all active:scale-95"
                            >
                                Track Service
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="h-14 bg-[#6B2FA0] text-white rounded-3xl text-sm font-semibold hover:bg-[#582186] transition-all active:scale-95 flex items-center justify-center gap-2"
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
