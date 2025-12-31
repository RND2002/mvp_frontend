"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <div className="flex gap-4 sticky top-24 self-start">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 w-20">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "relative w-full aspect-square rounded-xl border overflow-hidden transition-all duration-300",
                            selectedImage === img
                                ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                                : "border-[var(--color-border-gray)] hover:border-gray-400"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`Product thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-square rounded-2xl border border-[var(--color-border-gray)] bg-white overflow-hidden p-4">
                <Image
                    src={selectedImage}
                    alt="Product Main"
                    fill
                    className="object-contain"
                />
            </div>
        </div>
    );
};

export default ProductGallery;
