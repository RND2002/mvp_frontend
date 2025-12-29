"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface InlineSVGProps {
    src: string;
    className?: string;
    fallback?: React.ReactNode;
    alt?: string;
    width?: number;
    height?: number;
    preserveColors?: boolean;
    style?: React.CSSProperties;
    as?: React.ElementType;
}

const InlineSVG = ({
    src,
    className,
    fallback,
    alt,
    preserveColors = false,
    width = 100,
    height = 50,
    style,
    as = "div",
}: InlineSVGProps) => {
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const isSVG = src?.toLowerCase().endsWith(".svg");
    const Component = as as any;

    useEffect(() => {
        if (!isSVG) return;

        let isMounted = true;
        setError(false);
        setSvg("");

        fetch(src)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load: ${src}`);
                return res.text();
            })
            .then((text) => {
                if (isMounted) {
                    let cleaned = text;
                    if (!preserveColors) {
                        cleaned = cleaned
                            .replace(/fill="[^"]*"/g, 'fill="currentColor"')
                            .replace(/stroke="[^"]*"/g, 'stroke="currentColor"');
                    }
                    setSvg(cleaned);
                }
            })
            .catch(() => {
                if (isMounted) setError(true);
            });

        return () => {
            isMounted = false;
        };
    }, [src, isSVG]);

    if (!isSVG) {
        return (
            <Image
                src={src}
                alt={alt || "image"}
                width={width}
                height={height}
                className={`${className || ""} object-contain`}
                style={style}
            />
        );
    }

    if (error) {
        return (
            <Component className={className} style={style}>
                {fallback || (
                    <svg
                        className={className}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" />
                        <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" />
                    </svg>
                )}
            </Component>
        );
    }

    return (
        <Component
            className={className}
            style={style}
            dangerouslySetInnerHTML={{ __html: svg }}
            aria-label={alt}
            role="img"
        />
    );
};

export default InlineSVG;
