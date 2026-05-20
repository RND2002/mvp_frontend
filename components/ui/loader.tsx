import { Loader2 } from "lucide-react";
import Image from "next/image";
import Logo from "@/app/assets/icons/create-custom.svg";

interface LoaderProps {
    fullScreen?: boolean;
    text?: string;
    size?: "sm" | "md" | "lg";
}

export const Loader = ({ fullScreen = false, text, size = "md" }: LoaderProps) => {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-10 w-10"
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary-theme/90 backdrop-blur-xl animate-in fade-in duration-500">
                <div className="relative flex flex-col items-center">
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full border border-theme-green/20 animate-ping opacity-20" />
                        <div className="absolute h-40 w-40 rounded-full border border-theme-green/10 animate-[ping_2s_linear_infinite] opacity-10" />
                    </div>

                    {/* Logo and Spinner */}
                    <div className="relative bg-white border border-[#E4E7EC] p-8 rounded-[40px] flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <Image src={Logo} alt="Vroom" width={120} height={40} className="w-32 h-auto animate-pulse" />
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 text-theme-green animate-spin" />
                            {text && (
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-green animate-pulse">
                                    {text}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 gap-3 animate-in fade-in duration-300">
            <div className="relative">
                <Loader2 className={`${sizeClasses[size]} text-theme-green animate-spin`} />
                <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border border-theme-green/20 animate-ping`} />
            </div>
            {text && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569]">
                    {text}
                </span>
            )}
        </div>
    );
};
