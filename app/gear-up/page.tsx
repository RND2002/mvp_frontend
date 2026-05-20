"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Container from "@/app/components/common/Container";
import { PageHeader } from "@/app/components/common/PageHeader";
import { useGetRecommendationsQuery, Product } from "../beService/product-service";
import ProductCard from "@/components/ProductCard";
import { useSelector } from "react-redux";
import { selectSelectedVehicle } from "../store/slices/vehicleSlice";
import { Loader } from "@/components/ui/loader";
import { PillFilters } from "../components/common/PillFilters";

// Hardcoded categories as requested, acting as the "Amazon-style" filter strip.
// In a real scenario, these might also be fetched from an API.
const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "headlight", label: "Headlights" },
    { id: "tyres", label: "Tyres" },
    { id: "engine", label: "Engine" },
    { id: "body", label: "Body" },
    { id: "accessories", label: "Accessories" },
    { id: "electronics", label: "Electronics" },
];

export default function ModifyRidePage() {
    const selectedVehicle = useSelector(selectSelectedVehicle);

    // State for filtering and pagination
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [page, setPage] = useState(1);

    // "Products" list accumulator for infinite scroll
    const [products, setProducts] = useState<Product[]>([]);

    // State to track if there are more products to load
    const [hasMore, setHasMore] = useState(true);

    const vehicleId = selectedVehicle?.id || "";

    // Fetch data using RTK Query
    const { data, isFetching, error } = useGetRecommendationsQuery({
        vehicle_id: vehicleId,
        page: page,
        limit: 12,
        category: selectedCategory === "all" ? undefined : selectedCategory
    }, {
        skip: !vehicleId
    });

    // EFFECT: Handle Category or Vehicle Changes
    // Reset the product list and page number when the filter changes.
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCategory, vehicleId]);

    // EFFECT: Handle New Data Arrival
    // Append new data to the list. 
    useEffect(() => {
        if (data?.products) {
            setProducts(prev => {
                // If we are on page 1, strictly replace the list (fresh start)
                if (page === 1) return data.products;

                // For subsequent pages, append deeply.
                // We filter out duplicates based on ID to be safe against race conditions or re-fetches.
                const existingIds = new Set(prev.map(p => p.id));
                const newProducts = data.products.filter(p => !existingIds.has(p.id));

                return [...prev, ...newProducts];
            });

            // Determine if we have reached the end of the list
            // If the returned batch is empty OR the API explicitly says no more (if implemented), stop.
            // Using a simple heuristic: if returned items < limit (12), we are likely at the end.
            if (data.products.length < 12 || (data.pagination && !data.pagination.hasMore)) {
                setHasMore(false);
            }
        }
    }, [data, page]);

    // INFINITE SCROLL OBSERVER
    // Reference to the intersection observer
    const observer = useRef<IntersectionObserver | null>(null);

    // Callback ref for the last element in the list
    const lastProductRef = useCallback((node: HTMLDivElement) => {
        // If loading, don't trigger another fetch
        if (isFetching) return;

        // Disconnect previous observer
        if (observer.current) observer.current.disconnect();

        // Create new observer
        observer.current = new IntersectionObserver(entries => {
            // If the sentinel is in view and we have more data, increment page
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        // Observe the node
        if (node) observer.current.observe(node);
    }, [isFetching, hasMore]);


    return (
        <div className="bg-[#F8F9FB] min-h-screen pb-20">
            <Container className="py-8 px-4 sm:px-6 lg:px-8">
                {/* Standardized Page Header */}
                <PageHeader
                    title={<>Gear <span className="text-theme-green">Up</span></>}
                    subtitle={`Premium upgrades and accessories tailored for your ${selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : "vehicle"}.`}
                    backUrl="/dashboard"
                    className="mb-8"
                />

                {/* Category Filters (Sticky "Amazon-style" Strip) */}
                {vehicleId && (
                    <div className="sticky top-20 z-20 bg-primary-theme/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 mb-6 py-2">
                        <PillFilters
                            items={CATEGORIES}
                            selectedId={selectedCategory}
                            onSelect={setSelectedCategory}
                            className="px-4 sm:px-6 lg:px-8"
                        />
                    </div>
                )}

                {/* Main Content Area */}
                {!vehicleId ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-lg text-zinc-400 mb-4">Please select a vehicle to see recommendations.</p>
                    </div>
                ) : (
                    <>
                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {products.map((product, index) => {
                                // Attach ref to the last element to trigger infinite scroll
                                if (products.length === index + 1) {
                                    return (
                                        <div ref={lastProductRef} key={`${product.id}-${index}`} className="h-full">
                                            <ProductCard product={product} />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={`${product.id}-${index}`} className="h-full">
                                            <ProductCard product={product} />
                                        </div>
                                    );
                                }
                            })}
                        </div>

                        {/* Loading & Status States */}
                        <div className="py-12 flex justify-center w-full">
                            {isFetching && (
                                <Loader size="lg" text="Processing..." />
                            )}

                            {!isFetching && products.length === 0 && (
                                <div className="text-center text-zinc-400">
                                    <p>No products found in this category.</p>
                                </div>
                            )}

                            {!isFetching && products.length > 0 && !hasMore && (
                                <p className="text-sm text-zinc-500">You've reached the end of the list.</p>
                            )}
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}
