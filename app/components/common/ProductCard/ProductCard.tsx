import React from "react";
import Image from "next/image";
import { Plus, Star } from "lucide-react";

export interface ProductCardProps {
    image: string;
    title: string;
    weight: string;
    price: number;
    originalPrice: number;
    discount: string;
    rating?: number;
    ratingCount?: number;
    onAdd?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    image,
    title,
    weight,
    price,
    originalPrice,
    discount,
    rating,
    ratingCount,
    onAdd,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-[#E4E7EC] shadow-sm p-4 flex flex-col h-full relative group hover:shadow-md transition-all duration-200">
            {/* Image Area */}
            <div className="relative w-full aspect-[4/3] mb-3 bg-[#F8F9FB] border border-[#E4E7EC] rounded-xl overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain p-2 mix-blend-multiply"
                />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-start w-full">
                <h3 className="text-sm font-bold text-[#0F172A] line-clamp-2 leading-tight mb-1 min-h-[2.5em]">
                    {title}
                </h3>

                <p className="text-xs text-[#475569] font-medium mb-3">
                    {weight}
                </p>

                <div className="mt-auto w-full flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-[#94A3B8] line-through">
                            ₹{originalPrice}
                        </span>
                        <span className="text-base font-black text-[#0F172A]">
                            ₹{price}
                        </span>
                    </div>

                    <button
                        onClick={onAdd}
                        className="border border-[#6B2FA0] bg-white text-[#6B2FA0] hover:bg-[#6B2FA0] hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-none uppercase tracking-wider"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Absolute Floating Discount Badge */}
            <div className="absolute top-0 left-0 bg-[#6B2FA0] text-white text-[9px] font-bold px-2.5 py-1 rounded-tl-2xl rounded-br-2xl shadow-none z-10 uppercase tracking-wider">
                {discount}
            </div>
        </div>
    );
};

export default ProductCard;
