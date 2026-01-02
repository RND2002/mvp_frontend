import React from "react";
import ProductCard, { ProductCardProps } from "@/app/components/common/ProductCard/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductShelfProps {
    title: string;
    products: ProductCardProps[];
    viewAllLink?: string;
}

const ProductShelf: React.FC<ProductShelfProps> = ({ title, products, viewAllLink = "#" }) => {
    return (
        <div className="container mx-auto px-4 lg:px-0 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primaryText dark:text-white">{title}</h2>
                <Link
                    href={viewAllLink}
                    className="text-[#FF3269] font-bold text-sm hover:underline flex items-center"
                >
                    See All <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 md:pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 lg:mx-0 lg:px-0">
                {products.map((product, idx) => (
                    <div key={idx} className="min-w-[160px] md:min-w-[180px] w-[160px] md:w-[180px]">
                        <ProductCard {...product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductShelf;
