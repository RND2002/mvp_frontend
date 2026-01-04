import { Loader2 } from "lucide-react";

interface LoaderProps {
    fullScreen?: boolean;
    text?: string;
}

export const Loader = ({ fullScreen = false, text = "Loading..." }: LoaderProps) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-vehicle-card-bg border border-vehicle-card-border animate-in fade-in zoom-in-95 duration-200">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                    <p className="text-white font-medium text-lg">{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 text-green-500 animate-spin mr-2" />
            <span className="text-gray-400">{text}</span>
        </div>
    );
};
