"use client";

import React from "react";
import Container from "@/app/components/common/Container";
import ProductGallery from "@/app/components/product/ProductGallery";
import ProductInfo from "@/app/components/product/ProductInfo";
import productData from "@/app/json/product-details.json";

export default function ProductDetailsPage({ params }: { params: { productId: string } }) {
    // In a real app, use params.productId to fetch data. 
    // For MVP, we use the static mock data.

    return (
        <div className="bg-white min-h-screen pb-20">
            <Container className="py-6 lg:py-10 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
                    {/* Left - Sticky Gallery */}
                    <div className="lg:col-span-5 xl:col-span-5 h-max sticky top-24 z-10 hidden lg:block">
                        <ProductGallery images={productData.images} />
                    </div>

                    {/* Mobile Gallery (visible only on small) */}
                    <div className="lg:hidden mb-6 block">
                        <ProductGallery images={productData.images} />
                    </div>

                    {/* Right - Scrollable Info */}
                    <div className="lg:col-span-7 xl:col-span-7">
                        <ProductInfo data={productData} />
                    </div>
                </div>
            </Container>
        </div>
    );
}
