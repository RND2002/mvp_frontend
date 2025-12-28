"use client";

import { getRandomMotion } from "@/app/lib/motion";
import clsx from "clsx";
import { motion, MotionProps, MotionStyle } from "framer-motion";
import { ComponentPropsWithoutRef, ElementType } from "react";

type MotionWrapperProps<T extends ElementType> = {
    as?: T;
    delay?: number;
    children: React.ReactNode;
    className?: string;
    pulse?: boolean; // enable/disable pulsing
    pulseIntensity?: number; // e.g. 0.05 = 5% zoom
    pulseDuration?: number;
} & MotionProps &
    Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

function MotionWrapper<T extends ElementType = "div">({ as, children, className, ...rest }: MotionWrapperProps<T>) {
    const Component = as || "div";
    const MotionComponent = motion.create(Component as ElementType);
    return (
        <MotionComponent className={className} {...rest}>
            {children}
        </MotionComponent>
    );
}

export const ViewOneByOne = <T extends React.ElementType = "div">(props: MotionWrapperProps<T>) => {
    return (
        <MotionWrapper
            {...props}
            variants={{
                hidden: { opacity: 0, y: 40 },
                show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut", delay: props.delay },
                },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        />
    );
};

export const StaggerContainer = ({ children, className, style }: MotionWrapperProps<"div">) => (
    <MotionWrapper
        as="div"
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.25 } },
        }}
        style={style}
    >
        {children}
    </MotionWrapper>
);

export const FadeUp = <T extends React.ElementType = "div">(props: MotionWrapperProps<T>) => {
    return (
        <MotionWrapper
            {...props}
            variants={{
                hidden: { opacity: 0, y: 40 },
                show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut" },
                },
            }}
        />
    );
};

export const FadeScale = <T extends ElementType = "div">({ delay = 0, ...props }: MotionWrapperProps<T>) => {
    return (
        <MotionWrapper
            {...(props as MotionWrapperProps<T>)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={{
                hidden: { opacity: 0, scale: 1.06 },
                show: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                        duration: 0.8,
                        delay,
                        ease: [0.25, 0.8, 0.25, 1],
                    },
                },
            }}
        />
    );
};

export const SlideInRight = ({ children, delay, className }: MotionWrapperProps<"div">) => (
    <MotionWrapper
        as="div"
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
            hidden: { opacity: 0, x: 80 },
            show: {
                opacity: 1,
                x: 0,
                transition: { type: "spring", stiffness: 100, damping: 12, delay },
            },
        }}
    >
        {children}
    </MotionWrapper>
);

export const PopIn = ({ children, delay = 0, className, style, ...motionProps }: MotionWrapperProps<"div"> & { delay?: number }) => (
    <MotionWrapper
        as="div"
        className={className}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{
            opacity: 1,
            scale: 1,
            transition: { delay, duration: 0.5, ease: "easeOut" },
        }}
        viewport={{ once: true }}
        style={style}
        {...motionProps}
    >
        {children}
    </MotionWrapper>
);

export const SpringUp = ({ children, delay = 0, className, style }: MotionWrapperProps<"div"> & { delay?: number }) => (
    <MotionWrapper
        as="div"
        className={className}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay,
            },
        }}
        viewport={{ once: true, amount: 0.2 }}
        style={style}
    >
        {children}
    </MotionWrapper>
);

interface RandomMotionWrapperProps {
    children: React.ReactNode;
    mode?: "default" | "vertical";
    duration?: number;
    repeatDelay?: number;
    className?: string;
    style?: MotionStyle & React.CSSProperties;
    as?: ElementType;
}

export const RandomMotionWrapper: React.FC<RandomMotionWrapperProps> = ({
    children,
    mode = "default",
    duration = 6,
    repeatDelay = 0,
    className,
    style,
    as,
}) => {
    const Component = as || "div";
    const MotionComponent = motion.create(Component as ElementType);
    return (
        <MotionComponent
            className={className}
            animate={getRandomMotion(mode)}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                repeatDelay,
            }}
            style={style}
        >
            {children}
        </MotionComponent>
    );
};

interface AvatarMotionWrapperProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    scaleRange?: [number, number];
    duration?: number;
}

export const AvatarMotionWrapper: React.FC<AvatarMotionWrapperProps> = ({ children, className, delay = 0, scaleRange = [1, 1.15], duration = 2 }) => {
    return (
        <motion.div
            className={className}
            animate={{ scale: [scaleRange[0], scaleRange[1], scaleRange[0]] }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};

export const SlideInLeft = ({ children, className, delay = 0 }: MotionWrapperProps<"div"> & { delay?: number }) => (
    <MotionWrapper
        as="div"
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
            hidden: { opacity: 0, x: -80 },
            show: {
                opacity: 1,
                x: 0,
                transition: { type: "spring", stiffness: 100, damping: 12, delay },
            },
        }}
    >
        {children}
    </MotionWrapper>
);

export const SpringDown = ({ children, delay = 0, className, style }: MotionWrapperProps<"div"> & { delay?: number }) => (
    <MotionWrapper
        as="div"
        className={className}
        initial={{ opacity: 0, scale: 0.9, y: -30 }}
        whileInView={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay,
            },
        }}
        viewport={{ once: true, amount: 0.2 }}
        style={style}
    >
        {children}
    </MotionWrapper>
);

export const SlideInRightWithRotate = ({ children, delay, className, as = "div" }: MotionWrapperProps<"div">) => (
    <MotionWrapper
        as={as}
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
            hidden: {
                opacity: 0,
                x: 80,
                rotate: 30,
            },
            show: {
                opacity: 1,
                x: 0,
                rotate: 0,
                transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay,
                },
            },
        }}
    >
        {children}
    </MotionWrapper>
);

export const TextRevealRightChars = ({
    text,
    className,
    delay = 0,
    mode = "auto",
    stagger = 0.04,
}: {
    text: string;
    className?: string;
    delay?: number;
    mode?: "auto" | "char" | "word";
    stagger?: number;
}) => {
    const shouldAnimateByChar = mode === "char" || (mode === "auto" && !text.includes(" "));

    const items = shouldAnimateByChar ? Array.from(text) : text.split(" ");

    return (
        <motion.span
            className={clsx("inline-block overflow-hidden whitespace-pre-line", className)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: stagger,
                        delayChildren: delay,
                    },
                },
            }}
        >
            {items.map((item, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    variants={{
                        hidden: { opacity: 0, x: 40 },
                        show: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeOut",
                            },
                        },
                    }}
                >
                    {item === " " ? "\u00A0" : shouldAnimateByChar ? item : `${item}\u00A0`}
                </motion.span>
            ))}
        </motion.span>
    );
};
export const SlideInUp = ({ children, delay = 0, className, style }: MotionWrapperProps<"div"> & { delay?: number }) => (
    <MotionWrapper
        className={className}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay,
            },
        }}
        viewport={{ once: true, amount: 0.2 }}
        style={style}
    >
        {children}
    </MotionWrapper>
);

import React from "react";

export const ScaleUp = ({
    children,
    delay = 0,
    className,
    style,
    pulse = false,
    pulseIntensity = 0.12,
    pulseDuration = 1.6,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
    pulse?: boolean;
    pulseIntensity?: number;
    pulseDuration?: number;
}) => {
    if (!pulse) {
        return (
            <motion.div
                className={className}
                style={style}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay,
                }}
            >
                {children}
            </motion.div>
        );
    }

    // Pulse version - matches WorldMap structure exactly
    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay }}
        >
            <div className="relative flex items-center justify-center">
                {/* The actual pulsing child - absolutely positioned and centered */}
                <motion.div
                    className="absolute"
                    animate={{ scale: [1, 1 + pulseIntensity, 1] }}
                    transition={{
                        duration: pulseDuration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay,
                    }}
                >
                    {children}
                </motion.div>
            </div>
        </motion.div>
    );
};
