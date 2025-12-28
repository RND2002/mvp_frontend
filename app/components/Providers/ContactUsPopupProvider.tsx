"use client";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
    useCallback,
} from "react";
// import { AnimatePresence } from "framer-motion";
import ContactPopup, { ContactPopupProps } from "../Models/ContactPopup";
import CtaPopup, { CtaPopupProps } from "../Modals/CtaPopup";

interface PopupContextProps {
    showPopup: () => void;
    hidePopup: () => void;
    isOpen: boolean;
    hideCta: () => void;
    isCtaOpen: boolean;
}

interface ContactUsPopupProviderProps {
    children: ReactNode;
    contactData?: ContactPopupProps["data"];
    ctaContactData?: CtaPopupProps["data"];
}

const PopupContext = createContext<PopupContextProps | undefined>(undefined);

export const ContactUsPopupProvider: React.FC<ContactUsPopupProviderProps> = ({
    children,
    contactData,
    ctaContactData,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCtaOpen, setIsCtaOpen] = useState(false);

    const showPopup = () => setIsOpen(true);
    const hidePopup = () => setIsOpen(false);

    const hideCta = () => setIsCtaOpen(false);

    const initialTimerRef = useRef<number | null>(null);
    const idleTimerRef = useRef<number | null>(null);

    const clearAllTimers = useCallback(() => {
        if (initialTimerRef.current !== null) {
            window.clearTimeout(initialTimerRef.current);
            initialTimerRef.current = null;
        }
        if (idleTimerRef.current !== null) {
            window.clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isOpen || isCtaOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.maxHeight = "100vh";
        } else {
            document.body.style.overflow = "";
            document.body.style.maxHeight = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.maxHeight = "";
        };
    }, [isOpen, isCtaOpen]);

    useEffect(() => {
        return
        if (isOpen) {
            clearAllTimers();
            return;
        }

        if (initialTimerRef.current === null) {
            initialTimerRef.current = window.setTimeout(() => {
                if (!isOpen) setIsCtaOpen(true);
                initialTimerRef.current = null;
            }, 10000);
        }

        const resetIdle = () => {
            if (idleTimerRef.current !== null) {
                window.clearTimeout(idleTimerRef.current);
                idleTimerRef.current = null;
            }

            if (!isOpen) {
                idleTimerRef.current = window.setTimeout(() => {
                    if (!isOpen) setIsCtaOpen(true);
                    idleTimerRef.current = null;
                }, 20000);
            }
        };

        window.addEventListener("mousemove", resetIdle);
        window.addEventListener("scroll", resetIdle);
        window.addEventListener("keydown", resetIdle);
        window.addEventListener("click", resetIdle);

        resetIdle();

        return () => {
            window.removeEventListener("mousemove", resetIdle);
            window.removeEventListener("scroll", resetIdle);
            window.removeEventListener("keydown", resetIdle);
            window.removeEventListener("click", resetIdle);
            clearAllTimers();
        };
    }, [isOpen, clearAllTimers]);

    useEffect(() => {
        if (isOpen) {
            setIsCtaOpen(false);
        }
    }, [isOpen]);

    return (
        <PopupContext.Provider
            value={{
                showPopup,
                hidePopup,
                isOpen,
                hideCta,
                isCtaOpen,
            }}
        >
            {children}

            {/* <AnimatePresence> */}
            <ContactPopup onClose={hidePopup} open={isOpen} data={contactData} />
            {/* </AnimatePresence> */}

            {/* <AnimatePresence> */}
            <CtaPopup onClose={hideCta} open={isCtaOpen} data={ctaContactData} />
        </AnimatePresence>
        </PopupContext.Provider >
    );
};

export const usePopup = () => {
    const ctx = useContext(PopupContext);
    if (!ctx) throw new Error("usePopup must be used within PopupProvider");
    return ctx;
};
