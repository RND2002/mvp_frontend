
import React from 'react';
import Link from 'next/link';

interface ListItemProps {
    title: string;
    href?: string;
    className?: string;
}

const ListItem: React.FC<ListItemProps> = ({ title, href, className }) => {
    if (href) {
        return (
            <Link href={href} className={className}>
                {title}
            </Link>
        );
    }
    return <div className={className}>{title}</div>;
};

export default ListItem;
