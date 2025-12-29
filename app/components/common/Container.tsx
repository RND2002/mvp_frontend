// Container.tsx
import React, { ReactNode, CSSProperties } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

const Container: React.FC<ContainerProps> = ({
    children,
    className = "",
    style = {},
}) => {
    return (
        <div
            className={`mx-auto container ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

export default Container;
