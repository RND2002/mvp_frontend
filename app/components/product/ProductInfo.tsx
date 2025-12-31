"use client";

import React from "react";
import InlineSVG from "@/app/components/common/InlineSVG";
// Assume we might use icons later, for now using text/SVGs if needed

interface Coupon {
    code: string;
    description: string;
}

interface Highlight {
    label: string;
    value: string;
}

interface ProductInfoProps {
    data: {
        title: string;
        brand: string;
        price: number;
        mrp: number;
        netQty: string;
        rating: number;
        reviewCount: number;
        coupons: Coupon[];
        highlights: Highlight[];
        description: string;
    };
}

const ProductInfo: React.FC<ProductInfoProps> = ({ data }) => {
    return (
        <div className="flex flex-col gap-6">
            {/* Breadcrumb / Brand */}
            <div className="text-sm text-gray-500">
                Home {">"} category {">"} <span className="text-gray-900 font-medium">{data.title}</span>
            </div>

            {/* Title & Brand */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-600">Net Qty: {data.netQty}</span>
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-xs font-bold text-green-700">
                        <span>★ {data.rating}</span>
                        <span className="font-normal text-green-700/80">({data.reviewCount})</span>
                    </div>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-green-700">₹{data.price}</span>
                <span className="text-gray-400 line-through text-lg">MRP ₹{data.mrp}</span>
                <span className="text-xs text-gray-500">(Incl. of all taxes)</span>
            </div>

            {/* Add to Cart Button */}
            <button className="w-full sm:w-auto bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Add To Cart
            </button>

            <hr className="border-gray-100" />

            {/* Coupons */}
            <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800">Coupons & Offers</h3>
                <div className="space-y-3">
                    {data.coupons.map((coupon, idx) => (
                        <div key={idx} className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50/50">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)]">
                                %
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 flex items-center gap-2">
                                    {coupon.code} <span className="text-xs text-red-500 font-normal">{">"}</span>
                                </div>
                                <p className="text-xs text-gray-500">{coupon.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="text-[var(--color-primary)] text-sm font-semibold mt-3 hover:underline">
                    View all coupons
                </button>
            </div>

            <hr className="border-gray-100" />

            {/* Highlights */}
            <div>
                <h3 className="font-bold text-lg mb-4 text-gray-800">Highlights</h3>
                <div className="space-y-4">
                    {data.highlights.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-4 text-sm">
                            <span className="text-gray-500 col-span-1">{item.label}</span>
                            <span className="text-gray-900 col-span-2">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Description */}
            <div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {data.description}
                </p>
            </div>
        </div>
    );
};

export default ProductInfo;
