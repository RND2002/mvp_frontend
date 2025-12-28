"use client";

import { createContext, useContext, useState, useCallback } from "react";
// import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import InlineSVG from "@/components/common/InlineSVG";

type AlertType = "success" | "error" | "info";

interface Alert {
    id: string;
    message: string;
    type: AlertType;
}

interface AlertContextType {
    showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const removeAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, []);

    const showAlert = useCallback(
        (message: string, type: AlertType = "info", duration = 3000) => {
            const id = Math.random().toString(36).slice(2);
            setAlerts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => removeAlert(id), duration);
        },
        [removeAlert]
    );

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            {/* Alert container */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-9999999 cursor-pointer">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className={clsx(
                                "relative flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border backdrop-blur-md",
                                "overflow-hidden group hover:scale-[1.02] transition-transform duration-200 ease-out",
                                {
                                    "bg-green-600/70 border-green-400 text-white":
                                        alert.type === "success",
                                    "bg-primary/60 border-primary/30 text-white":
                                        alert.type === "error",
                                    "bg-blue-600/70 border-blue-400 text-white":
                                        alert.type === "info",
                                }
                            )}
                        >
                            {/* Left glowing bar */}
                            <span
                                className={clsx(
                                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                                    {
                                        "bg-green-300": alert.type === "success",
                                        "bg-primary/20": alert.type === "error",
                                        "bg-blue-300": alert.type === "info",
                                    }
                                )}
                            />

                            {/* Icon */}
                            <div
                                className={clsx(
                                    "p-1.5 rounded-full bg-white/15 flex items-center justify-center",
                                    {
                                        "text-green-200": alert.type === "success",
                                        "text-primary/20": alert.type === "error",
                                        "text-blue-200": alert.type === "info",
                                    }
                                )}
                            >
                                <InlineSVG
                                    src={
                                        alert.type === "success"
                                            ? "/icons/alert/check.svg"
                                            : alert.type === "error"
                                                ? "/icons/alert/error.svg"
                                                : "/icons/alert/info.svg"
                                    }
                                    className="w-4 h-4 text-white"
                                    preserveColors
                                />
                            </div>

                            {/* Message */}
                            <span className="text-sm font-medium flex-1">
                                {alert.message}
                            </span>

                            {/* Close button */}
                            <button
                                onClick={() => removeAlert(alert.id)}
                                className="opacity-70 hover:opacity-100 transition"
                            >
                                <InlineSVG
                                    src="/icons/contact-us/pop-up/cross.svg"
                                    preserveColors
                                    className="w-3.5 h-3.5"
                                />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </AlertContext.Provider>
    );
}
