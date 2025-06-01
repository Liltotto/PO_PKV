// @flow
import * as React from 'react';
import { Button } from './button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrossButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    fn: () => void;
}

const CrossButton = React.forwardRef<HTMLButtonElement, CrossButtonProps>(
    ({ className, fn, ...props }, ref) => (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                fn();
            }}
            className={cn(
                'absolute right-1 top-1/2 transform -translate-y-1/2 p-3 text-gray-500 hover:text-gray-700 hover:bg-transparent focus:outline-none w-auto h-auto z-10',
                className,
            )}
            {...props}
        >
            <X className="w-4 h-4 text-primary" />
        </Button>
    ),
);

CrossButton.displayName = 'CrossButton';

export { CrossButton };
