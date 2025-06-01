'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex items-center">
            {theme === 'dark' ? (
                <Button
                    variant="ghost"
                    size={'icon'}
                    className="hover:bg-transparent"
                    onClick={() => setTheme('light')}
                >
                    <Sun />
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    size={'icon'}
                    className="hover:bg-transparent"
                    onClick={() => setTheme('dark')}
                >
                    <Moon />
                </Button>
            )}
        </div>
    );
};

export default ThemeSwitcher;
