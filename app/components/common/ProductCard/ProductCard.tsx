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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-3 flex flex-col h-full relative group hover:shadow-md transition-shadow">
            {/* Image Area */}
            <div className="relative w-full aspect-[4/3] mb-3 bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                />

                {/* Discount Tag (if high discount, optional placement) */}
                {/* <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg">
                    {discount}
                </div> */}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-start w-full">
                {/* Timer / ETA Placeholder (Opional Zepto feature) */}
                {/* <div className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-2 text-slate-600">
                    9 MINS
                </div> */}

                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight mb-1 min-h-[2.5em]">
                    {title}
                </h3>

                <p className="text-xs text-slate-500 font-medium mb-3">
                    {weight}
                </p>

                {/* Rating (Optional based on screenshot) */}
                {/* {rating && (
                    <div className="flex items-center gap-1 bg-green-50 px-1 rounded border border-green-100 mb-2">
                        <Star className="w-2 h-2 text-green-600 fill-green-600" />
                        <span className="text-[10px] font-bold text-green-700">{rating} ({ratingCount})</span>
                    </div>
                )} */}

                <div className="mt-auto w-full flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400 line-through">
                            ₹{originalPrice}
                        </span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">
                            ₹{price}
                        </span>
                    </div>

                    <button
                        onClick={onAdd}
                        className="border border-[#FF3269] bg-white text-[#FF3269] hover:bg-[#FF3269] hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm uppercase tracking-wide"
                    >
                        Add
                    </button>
                </div>

                {/* Discount Badge on Price Side or Bottom? Zepto usually puts it next to price or on image. */}
                {/* Let's put a small green badge above price if needed or just keep it simple as screenshot */}
            </div>

            {/* Absolute Floating Discount Badge like screenshot */}
            <div className="absolute top-0 left-0 bg-[#56a827] text-white text-[10px] font-bold px-2 py-1 rounded-tl-xl rounded-br-xl shadow-sm z-10">
                {discount}
            </div>
        </div>
    );
};

export default ProductCard;
