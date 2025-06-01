'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { DropdownList } from './DropdownList';
import './search.css';

interface SearchProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    onValueChange: (value: string) => void;
    inputHistory?: string[];
}

const Search = ({
    className,
    value,
    onValueChange,
    inputHistory,
    ...props
}: SearchProps) => {
    const [opened, setOpened] = useState<boolean | null>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isDropdownHovered, setIsDropdownHovered] = useState(false);

    const showDropdown = isInputFocused || isDropdownHovered;

    const suggestions = useMemo(() => {
        if (!inputHistory?.length || !value) return [];
        return inputHistory
            .filter(
                (item) =>
                    item.toLowerCase().includes(value.toLowerCase()) &&
                    item !== value,
            )
            .slice(0, 3);
    }, [inputHistory, value]);

    const handleToggleButton = () => {
        if (opened) onValueChange('');
        setOpened(!opened);
    };

    const handleKeyDown = (key: string) => {
        if (key === 'Escape') {
            onValueChange('');
            setOpened(false);
        }
    };

    return (
        <div
            className={cn(
                'flex relative items-center justify-center gap-2 flex-row-reverse self-center',
                className,
            )}
            {...props}
        >
            <Button onClick={handleToggleButton} size="sm">
                <SearchIcon />
            </Button>
            <div className="relative">
                <Input
                    value={value}
                    placeholder="Поиск..."
                    onKeyDown={(e) => handleKeyDown(e.key)}
                    onChange={(e) => onValueChange(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    className={cn('border-primary origin-right scale-0', {
                        'expand-animation': opened,
                        'collapse-animation': opened !== null && !opened,
                    })}
                />
                {showDropdown && (
                    <div
                        onMouseEnter={() => setIsDropdownHovered(true)}
                        onMouseLeave={() => setIsDropdownHovered(false)}
                    >
                        <DropdownList items={suggestions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export { Search };
