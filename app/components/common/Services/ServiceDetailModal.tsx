import React from "react";
import { X, Check, Star, ArrowLeft, FileText, Share2 } from "lucide-react";
import PrimaryButton from "@/app/components/common/PrimaryButton";
import Image from "next/image";

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        label: string;
        icon?: any; // Just for fallback if needed
        color?: string; // For theme
    } | null;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
    isOpen,
    onClose,
    service,
}) => {
    if (!isOpen || !service) return null;

    // Mock data filling for the specific UI shown in screenshot
    const expectedPrice = 400;
    const mechanic = {
        name: "Brandon Dan CK",
        role: "Mechanic / Service",
        rating: 4.8,
        experience: "7 Years Exp",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=60&w=200", // Generic mechanic image
    };

    const serviceIncludes = [
        "Engine oil.",
        "Radiator coolant.",
        "Windscreens & mirrors - for cracks",
        "Power steering fluid.",
        "Windscreen washer fluid.",
        "Clutch fluid (manual cars)",
        "Gearbox oil.",
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg md:max-w-xl h-[90vh] md:h-auto md:max-h-[90vh] bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:m-4 animate-slide-up">

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto pb-24 md:pb-6 scrollbar-hide">
                    {/* Header Image Section */}
                    <div className="relative w-full h-64 md:h-72">
                        <Image
                            src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1000" // Car service image
                            alt="Service Header"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div> {/* Top gradient for nav visibility */}

                        {/* Top Nav */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white">
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2">
                                {/* <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                             <Share2 className="w-5 h-5" />
                         </button> */}
                            </div>
                        </div>

                        {/* Service Title Overlay */}
                        <div className="absolute bottom-16 left-6 text-white text-shadow-lg">
                            <p className="text-yellow-400 font-bold mb-1 tracking-wide uppercase text-xs">Service Company Name</p>
                            <h2 className="text-3xl font-bold mb-1">{service.label}</h2>
                            <p className="text-lg font-medium opacity-90">Expected Price - $ {expectedPrice}</p>
                        </div>
                        <div className="absolute bottom-20 right-6 text-white text-xs font-semibold opacity-80">
                            17:52 PM
                        </div>
                    </div>

                    {/* Content Overlay Card */}
                    <div className="relative -mt-12 bg-slate-50 dark:bg-slate-900 rounded-t-[2.5rem] px-6 pt-8 pb-8 min-h-[300px]">

                        {/* Mechanic Profile Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 mb-8">
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{mechanic.name}</h3>
                                <p className="text-slate-400 text-xs font-medium mb-1">{mechanic.role}</p>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                                    ))}
                                </div>
                                <button className="text-blue-600 text-xs font-bold hover:underline">
                                    Add New Mechanic
                                </button>
                            </div>
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md">
                                <Image
                                    src={mechanic.avatar}
                                    alt="Mechanic"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 right-0 left-0 bg-black/60 text-white text-[9px] text-center py-1">
                                    {mechanic.experience}
                                </div>
                            </div>
                        </div>

                        {/* Service Includes */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Service Includes</h3>
                                <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline">
                                    Invoice <FileText className="w-3 h-3" />
                                </button>
                            </div>

                            <ul className="space-y-3">
                                {serviceIncludes.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                                        <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="text-slate-800 dark:text-white font-bold text-sm mt-4 hover:underline">
                                View All
                            </button>
                        </div>

                        {/* Related Services (Visual Placeholder) */}
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4">Related Services</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {/* Mock Related Cards */}
                                <div className="min-w-[140px] bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                        {/* Icon placeholder */}
                                        <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Full Body</span>
                                        <span className="text-[10px] text-slate-500">Painting</span>
                                    </div>
                                </div>
                                <div className="min-w-[140px] bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                        {/* Icon placeholder */}
                                        <div className="w-4 h-4 bg-pink-400 rounded-sm"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Ac</span>
                                        <span className="text-[10px] text-slate-500">Service</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Floating Action Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900">
                    <PrimaryButton
                        className="w-full !rounded-full !py-4 text-base font-bold shadow-xl shadow-red-200 !bg-red-500 hover:!bg-red-600 !text-white"
                        openPopup={false}
                        onClick={() => alert("Booking Initiated!")}
                    >
                        Book Service
                    </PrimaryButton>
                </div>

            </div>
        </div>
    );
};
