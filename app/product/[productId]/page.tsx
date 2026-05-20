"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Share2, Wrench } from "lucide-react";
import { toast } from "sonner";

import Container from "@/app/components/common/Container";
import { useGetProductByIdQuery } from "../../beService/product-service";
import { useAddToCartMutation } from "../../beService/cart-items-service";
import { selectSelectedVehicle } from "../../store/slices/vehicleSlice";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.productId as string;
    const selectedVehicle = useSelector(selectSelectedVehicle);

    const { data, isFetching, error } = useGetProductByIdQuery(productId, {
        skip: !productId,
    });

    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

    const product = data?.product;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleAddToCart = async () => {
        if (!product || !selectedVehicle) {
            toast.error("Please select a vehicle to add items to cart.");
            return;
        }

        try {
            await addToCart({
                vehicle_id: selectedVehicle.id,
                product_id: product.id,
                quantity: 1,
                price_snapshot: product.price,
                requires_installation: product.requires_installation
            }).unwrap();

            toast.success("Added to cart!");
        } catch (err) {
            console.error("Failed to add to cart:", err);
            toast.error("Failed to add to cart. Please try again.");
        }
    };

    const handleNextImage = () => {
        if (!product?.image_urls) return;
        setCurrentImageIndex((prev) => (prev + 1) % product.image_urls.length);
    };

    const handlePrevImage = () => {
        if (!product?.image_urls) return;
        setCurrentImageIndex((prev) => (prev - 1 + product.image_urls.length) % product.image_urls.length);
    };

    if (isFetching) {
        return (
            <div className="bg-[#F8F9FB] min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-green text-theme-green"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="bg-[#F8F9FB] min-h-screen py-20 text-center px-4">
                <h2 className="text-[#0F172A] text-xl font-bold mb-2">Product Not Found</h2>
                <p className="text-zinc-400 mb-6">We couldn't find the product you're looking for.</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-[#F5EDFC] text-white rounded-lg hover:bg-[#F5EDFC]/80 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#F8F9FB] min-h-screen pb-40">
            <Container className="py-6 px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb / Back Navigation */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-zinc-400 hover:text-white transition-colors mb-6 text-sm group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Gear Up
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* LEFT: Image Carousel */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full aspect-[4/3] bg-[#F5EDFC] rounded-2xl overflow-hidden border border-[#E4E7EC] group">
                            {product.image_urls && product.image_urls.length > 0 ? (
                                <>
                                    <Image
                                        src={product.image_urls[currentImageIndex]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Carousel Controls */}
                                    {product.image_urls.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-zinc-500">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.image_urls && product.image_urls.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                                {product.image_urls.map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-theme-green opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <Image
                                            src={url}
                                            alt={`${product.name} View ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="px-3 py-1 bg-[#F5EDFC] text-theme-green text-xs font-bold uppercase rounded-full tracking-wider border border-border-primaryBorder">
                                {product.category}
                            </span>
                            <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-[#F5EDFC]">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                            {product.name}
                        </h1>

                        {/* Price & Stock */}
                        <div className="flex items-end gap-4 mb-6 pb-6 border-b border-[#E4E7EC]">
                            <div className="flex flex-col">
                                <span className="text-zinc-500 text-sm mb-1">Price</span>
                                <span className="text-3xl font-bold text-white">
                                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Stock Status Badge */}
                            <div className="mb-1.5">
                                {product.stock_quantity > 0 ? (
                                    <div className="flex items-center gap-1.5 text-theme-green bg-theme-green/10 px-3 py-1 rounded-full text-sm font-medium">
                                        <CheckCircle className="w-4 h-4" />
                                        In Stock
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-theme-red bg-theme-red/10 px-3 py-1 rounded-full text-sm font-medium">
                                        <AlertCircle className="w-4 h-4" />
                                        Out of Stock
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Compatibility */}
                        {selectedVehicle && (
                            <div className="mb-6 bg-theme-green/10 border border-theme-green/20 rounded-xl p-4 flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-theme-green flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-[#0F172A] font-medium text-sm">Compatible with your vehicle</h4>
                                    <p className="text-white/80 text-xs mt-1">
                                        Verified fit for {selectedVehicle.brand} {selectedVehicle.model}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Installation Awareness */}
                        {product.requires_installation && (
                            <div className="mb-8 bg-zinc-900 border border-[#E4E7EC] rounded-xl p-5 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-theme-green/10 rounded-bl-full -mr-4 -mt-4 z-0" />

                                <div className="relative z-10 flex items-start gap-3">
                                    <div className="p-2.5 bg-[#F5EDFC] rounded-lg text-theme-green shrink-0">
                                        <Wrench className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Installation Available</h3>
                                        <ul className="space-y-1.5 mt-2">
                                            <li className="text-sm text-zinc-400 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                                                Installed by verified mechanics
                                            </li>
                                            <li className="text-sm text-zinc-400 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                                                Doorstep or garage service
                                            </li>
                                            <li className="text-sm text-zinc-400 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-zinc-500 rounded-full" />
                                                Schedule during checkout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="mb-8">
                            <h3 className="text-white font-semibold mb-3">About this item</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                    </div>
                </div>
            </Container>

            {/* Bottom Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E4E7EC] p-4 z-[100] safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <Container className="!py-0 px-4 sm:px-6 lg:px-8 max-h-[80px]">
                    <div className="flex items-center justify-between gap-3 sm:gap-4 pl-12 sm:pl-0">
                        <div className="flex flex-col shrink-0">
                            <span className="text-zinc-400 text-[10px] hidden xs:block">Total</span>
                            <span className="text-[#0F172A] font-bold text-lg leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex-1 flex gap-2 sm:gap-3 justify-end items-center">
                            <button className="flex-none border border-[#E4E7EC] bg-[#F5EDFC]/50 text-white font-medium p-3 sm:py-3 sm:px-6 rounded-xl hover:bg-[#F5EDFC] transition-colors active:scale-95">
                                <span className="sm:hidden"><Share2 className="w-5 h-5" /></span>
                                <span className="hidden sm:inline">Save for Later</span>
                            </button>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0 || isAddingToCart}
                                className={`
                                    flex-1 sm:flex-none py-3 px-4 sm:px-8 rounded-xl font-bold text-white text-sm sm:text-base shadow-lg shadow-theme-green/25 transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${product.stock_quantity > 0 && !isAddingToCart
                                        ? 'bg-theme-green hover:bg-theme-green/80'
                                        : 'bg-zinc-700 cursor-not-allowed text-zinc-400 shadow-none'
                                    }
                                `}
                            >
                                <span className="whitespace-nowrap">
                                    {isAddingToCart ? "Adding..." :
                                        product.stock_quantity === 0 ? "Out of Stock" :
                                            product.requires_installation ? (
                                                <>
                                                    <span className="sm:hidden">Add & Schedule</span>
                                                    <span className="hidden sm:inline">Add & Schedule Installation</span>
                                                </>
                                            ) : "Add to Cart"}
                                </span>
                            </button>
                        </div>
                    </div>
                </Container>
            </div >
        </div >
    );
}
