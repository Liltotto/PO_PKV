import * as React from 'react';
import { DropdownItem } from './DropdownItem';

export const DropdownList = ({ items }: { items: string[] }) => {
    if (!items.length) return null;
    return (
        <div className="absolute overflow-hidden bg-background border border-primary rounded w-full top-full flex flex-col mt-2">
            {items.map((item) => (
                <DropdownItem value={item} />
            ))}
        </div>
    );
};
