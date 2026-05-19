import React from 'react';
import { ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_urls: string[];
    requires_installation: boolean;
}

interface ProductCardProps {
    product: Product;
}

const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        // Handle relative paths or invalid strings
        return url.startsWith('/') || url.startsWith('http');
    }
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Link href={`/product/${product.id}`} className="group relative w-full h-full bg-primaryCard rounded-xl border border-secondary-theme hover:border-theme-amber/50 transition-all duration-300 overflow-hidden flex flex-col block">
            {/* Image Container */}
            <div className="relative w-full aspect-[4/3] bg-secondary-theme overflow-hidden">
                {product.image_urls && product.image_urls.length > 0 && isValidUrl(product.image_urls[0]) ? (
                    <Image
                        src={product.image_urls[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-zinc-500 text-xs bg-zinc-900/50">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    {product.stock_quantity > 0 ? (
                        <div className="bg-[#111111]/90 border border-theme-amber/30 backdrop-blur-sm text-theme-amber text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" />
                            <span>In Stock</span>
                        </div>
                    ) : (
                        <div className="bg-theme-red/90 backdrop-blur-sm text-theme-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            <span>Out of Stock</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1">
                {/* Category */}
                <span className="text-[10px] font-medium text-theme-amber uppercase tracking-wider mb-1">
                    {product.category}
                </span>

                {/* Title */}
                <h3 className="text-sm font-bold text-white line-clamp-2 mb-1 group-hover:text-theme-amber transition-colors">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3 flex-1">
                    {product.description}
                </p>

                {/* Footer: Price & Action */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-secondary-theme">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500">Price</span>
                        <span className="text-lg font-bold text-white">
                            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <button
                        className="p-2 bg-theme-amber hover:bg-theme-amber-hover text-black rounded-[6px] active:scale-[0.98] transition-all duration-200"
                        aria-label="Add to cart"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to cart logic here
                        }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
