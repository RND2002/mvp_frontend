import type { Transition, Variants } from "framer-motion";
type Direction = "left" | "right" | "top" | "bottom";

// Dropdown (open/close animation)
export const dropdownAnimation: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            bounce: 0.25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: { duration: 0.2, ease: "easeInOut" },
    },
};

// List container (handles stagger)
export const staggerListAnimation: Variants = {
    visible: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

// List item (individual element)
export const listItemAnimation: Variants = {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
};

// Grid container (delays child animations)
export const gridAnimation: Variants = {
    hidden: {},
    show: {
        transition: {
            delayChildren: 0.1,
        },
    },
};

// Card (fade + slide up)
export const cardAnimation: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
};

// Slide in from left
export const slideInLeftAnimation: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 400, damping: 20, staggerChildren: 0.08, },
    },
};

// Rotating text (slide + scale + fade)
export const rotatingTextVariants: Variants = {
    enter: (direction: Direction) => {
        switch (direction) {
            case "left":
                return { x: "-100%", y: 0, scale: 0.5, opacity: 0 };
            case "right":
                return { x: "100%", y: 0, scale: 0.5, opacity: 0 };
            case "top":
                return { x: 0, y: "-100%", scale: 0.5, opacity: 0 };
            case "bottom":
                return { x: 0, y: "100%", scale: 0.5, opacity: 0 };
        }
    },
    center: { x: 0, y: 0, scale: 1, opacity: 1 },
    exit: (direction: Direction) => {
        switch (direction) {
            case "left":
                return { x: "-100%", y: 0, scale: 0.5, opacity: 0 };
            case "right":
                return { x: "100%", y: 0, scale: 0.5, opacity: 0 };
            case "top":
                return { x: 0, y: "-100%", scale: 0.5, opacity: 0 };
            case "bottom":
                return { x: 0, y: "100%", scale: 0.5, opacity: 0 };
        }
    },
};

// Transition settings for rotating text animation
export const rotatingTextTransition: Transition = {
    x: { type: "spring", stiffness: 250, damping: 25 },
    scale: { type: "spring", stiffness: 300, damping: 20 },
    opacity: { duration: 0.4 },
};

// stagger Card Animation (fade + slide up + scale)
export const statCardAnimation: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.25,
            duration: 1.2,
            ease: [0.25, 0.1, 0.25, 1],
        },
    }),
};

// Container (staggered children)
export const staggerContainerAnimation: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.25,
        },
    },
};


type PopInDirection = "top" | "bottom" | "left" | "right";

export const popInCardAnimation = (
    direction: PopInDirection = "bottom",
    distance: number = 30
): Variants => {
    let hidden: { opacity: number; scale: number; x?: number; y?: number } = {
        opacity: 0,
        scale: 0.6,
    };

    switch (direction) {
        case "top":
            hidden.y = -distance;
            break;
        case "bottom":
            hidden.y = distance;
            break;
        case "left":
            hidden.x = -distance;
            break;
        case "right":
            hidden.x = distance;
            break;
    }

    return {
        hidden,
        show: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 12,
            },
        },
    };
};

export const getRandomMotion = (
    mode: "default" | "vertical" = "default"
) => {
    const rand = (min: number, max: number) =>
        Math.random() * (max - min) + min;

    if (mode === "vertical") {
        return {
            x: [0, 0, 0, 0], // no horizontal movement
            y: [0, rand(-15, -5), rand(5, 15), 0], // up/down only
            rotateX: [0, 0, 0, 0], // no rotation
            rotateY: [0, 0, 0, 0],
        };
    }

    return {
        rotateX: [0, rand(2, 8), rand(-8, -2), 0],
        rotateY: [0, rand(-8, -2), rand(2, 8), 0],
        x: [0, rand(-10, 10), rand(-15, 15), 0],
        y: [0, rand(-10, 10), rand(5, -5), 0],
    };
};

// Parent container (stagger for images)
export const showcaseParentAnimation: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.18 } },
};

// Each image (slide up + fade in)
export const showcaseImageAnimation: Variants = {
    hidden: { y: 120, opacity: 0, scale: 0.98 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

// Middle button (pop in)
export const showcaseCreateButtonAnimation: Variants = {
    hidden: { scale: 0.8, opacity: 0, y: -6 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

// Hand icon (hover wiggle / shift)
export const showcaseHandHoverAnimation: Variants = {
    hover: { x: -20, y: -20 },
};

export const circleVariants: Variants = {
    hidden: (direction: "top" | "bottom") => ({
        opacity: 0,
        x: direction === "top" ? -80 : 80,
        y: direction === "top" ? -80 : 80,
        scale: 0.9,
    }),
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

export const fadeUp: Variants = {
    hidden: { y: 80, opacity: 0 },
    visible: (delay = 0) => ({
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut", delay },
    }),
};

export const flagVariant: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.35,
            type: "spring",
            stiffness: 180,
            damping: 18,
        },
    }),
    pulse: {
        scale: [0.6, 1, 0.6],
        transition: {
            duration: 6,
            repeat: Infinity,
            repeatType: "mirror",
        },
    },
};