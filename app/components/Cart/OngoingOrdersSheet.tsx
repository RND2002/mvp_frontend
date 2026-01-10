"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Package } from "lucide-react";
import { FulfillmentType, OrderStatus } from "@/app/beService/order-service";

interface OngoingOrdersSheetProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    orders: any[]; // Using any for now to avoid strict type issues with joins, or I can import Order type
}

export default function OngoingOrdersSheet({ open, setOpen, orders }: OngoingOrdersSheetProps) {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-full sm:max-w-[400px] bg-primary-theme border-l border-secondary-theme text-white p-0">
                <SheetHeader className="p-4 border-b border-secondary-theme flex flex-row items-center gap-4 space-y-0">
                    <button
                        onClick={() => setOpen(false)}
                        className="text-zinc-400 hover:text-white transition-colors -ml-2 p-2"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <SheetTitle className="text-xl font-bold flex items-center gap-2 text-white">
                        <Package className="w-5 h-5 text-brand-primary-500" />
                        Ongoing Orders
                    </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-80px)]">
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
                            <Package className="w-12 h-12 mb-4 opacity-50" />
                            <p>No ongoing orders</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="bg-primaryCard border border-secondary-theme rounded-xl p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-white font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-zinc-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
                                        {order.order_status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-zinc-300">{item.product_name}</span>
                                            <span className="text-zinc-500 font-mono">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Fulfillment Status */}
                                <div className="mt-3 pt-3 border-t border-secondary-theme">
                                    {order.order_fulfillments?.map((fulfillment: any) => (
                                        <div key={fulfillment.id} className="flex items-center gap-2 text-xs text-zinc-400">
                                            <div className={`w-2 h-2 rounded-full ${fulfillment.status === 'completed' ? 'bg-green-500' :
                                                    fulfillment.status === 'shipping' ? 'bg-blue-500' : 'bg-yellow-500'
                                                }`} />
                                            <span className="capitalize">{fulfillment.fulfillment_type}: {fulfillment.status.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
