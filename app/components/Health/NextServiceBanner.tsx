"use client"

import { VroomButton } from "../common/VroomButton"

interface NextServiceBannerProps {
    kmRemaining?: number;
    onClick?: () => void;
}

export const NextServiceBanner = ({ kmRemaining = 1250, onClick }: NextServiceBannerProps) => {
    return (
        <div className="mt-4 bg-theme-green rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group">
            {/* Background design pattern shim */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black rounded-full -ml-12 -mb-12 blur-2xl"></div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-1">Next Service</p>
                <h4 className="text-xl font-black text-black">In {kmRemaining.toLocaleString()} KM</h4>
            </div>

            <VroomButton
                onClick={onClick}
                variant="secondary"
                className="bg-black hover:bg-black/80 text-white font-black text-xs uppercase tracking-widest px-6 h-10 rounded-xl transition-transform active:scale-95 border-none"
            >
                Book Now
            </VroomButton>
        </div>
    )
}
