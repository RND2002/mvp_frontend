import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Wrench } from "lucide-react";
import { CartItem as CartItemType } from "@/app/beService/cart-items-service";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity?: (id: string, quantity: number) => void;
    onRemove?: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    const { product, quantity, requires_installation } = item;

    if (!product) return null;

    return (
        <div className="flex gap-4 p-4 bg-primaryCard border border-secondary-theme rounded-xl hover:border-brand-primary-500/30 transition-colors">
            {/* Product Image */}
            <div className="relative w-24 h-24 shrink-0 bg-secondary-theme rounded-lg overflow-hidden">
                {product.image_urls?.[0] ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-zinc-600 text-xs">
                        No Image
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <span className="text-[10px] font-bold text-brand-primary-400 uppercase tracking-wider bg-secondary-theme px-2 py-0.5 rounded-full">
                                {product.category}
                            </span>
                            <h3 className="text-white font-semibold line-clamp-2 mt-1 leading-tight">
                                {product.name}
                            </h3>
                        </div>
                        {onRemove && (
                            <button
                                onClick={() => onRemove(item.id)}
                                className="text-zinc-500 hover:text-red-400 p-1 -mr-1 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {requires_installation && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400">
                            <Wrench className="w-3.5 h-3.5 text-brand-primary-500" />
                            <span>Installation included</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="text-white font-bold text-lg">
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    {/* Quantity Controls (Placeholder for now) */}
                    <div className="flex items-center justify-center gap-3 bg-secondary-theme rounded-lg p-1">
                        <span className="text-zinc-400 text-xs px-2">Qty: {quantity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
