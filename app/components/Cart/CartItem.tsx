import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Wrench, ShoppingBag } from "lucide-react";
import { CartItem as CartItemType } from "@/app/beService/cart-items-service";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity?: (id: string, quantity: number) => void;
    onRemove?: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    const product = item.product || item.products;
    const { quantity, requires_installation } = item;

    if (!product) return null;

    const displayPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

    return (
        <div className="group relative flex gap-5 p-5 bg-white border border-[#5c707a]/20 rounded-[2.5rem] hover:border-theme-green/30 transition-all duration-500 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-green/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-theme-green/10 transition-colors duration-700"></div>

            {/* Product Image Section */}
            <div className="relative w-28 h-28 shrink-0 rounded-[1.75rem] overflow-hidden border border-[#E4E7EC] bg-white">
                {product.image_urls?.[0] ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-[#5c707a] bg-linear-to-b from-white/5 to-transparent">
                        <ShoppingBag className="w-5 h-5 mb-1 opacity-20" />
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">No Image</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-theme-green/10 border border-theme-green/20 text-theme-green text-[8px] font-black uppercase tracking-widest">
                                    {product.category}
                                </span>
                                {requires_installation && (
                                    <div className="flex items-center gap-1 text-[#475569]">
                                        <Wrench className="w-2.5 h-2.5" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Setup Inc.</span>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-[#0F172A] font-black text-sm uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-theme-green transition-colors">
                                {product.name}
                            </h3>
                        </div>
                        {onRemove && (
                            <button
                                onClick={() => onRemove(item.id)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-end justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-[#94A3B8] uppercase tracking-widest mb-0.5">Unit Price</span>
                        <div className="text-[#0F172A] font-black text-xl tracking-tighter">
                            ₹{displayPrice.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-[#F8F9FB] border border-[#E4E7EC] rounded-2xl p-1.5 px-4 h-11">
                        <span className="text-[#475569] text-[9px] font-black uppercase tracking-widest">Qty</span>
                        <div className="w-px h-3 bg-[#F5EDFC]"></div>
                        <span className="text-theme-green font-black text-sm">{quantity}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
