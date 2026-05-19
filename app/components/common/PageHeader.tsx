"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    rightElement?: React.ReactNode;
    className?: string;
    showBackButton?: boolean;
    backUrl?: string; // If provided, goes to this URL, else router.back()
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    rightElement,
    className,
    showBackButton = true,
    backUrl
}) => {
    const router = useRouter();

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            router.back();
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 mb-6", className)}>
            <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4 flex-1">
                    {showBackButton && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-all active:scale-95 shrink-0"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    <div className="flex-1">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight leading-tight">
                            {title}
                        </h1>
                    </div>
                </div>
                {rightElement && (
                    <div className="shrink-0 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
            {subtitle && (
                <div className={cn(
                    "text-gray-500 font-medium tracking-tight text-[11px] md:text-xs max-w-2xl mt-0",
                    showBackButton ? "ml-14" : "ml-0"
                )}>
                    {subtitle}
                </div>
            )}
        </div>
    );
};
