import * as React from 'react';

import { cn } from '@/lib/utils';
import { CrossButton } from './cross-button';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const [isFilled, setIsFilled] = React.useState(
            props.value ? true : false,
        );

        React.useEffect(() => {
            if (props.value) {
                return setIsFilled(true);
            }
            setIsFilled(false);
        }, [props.value]);

        const clearInput = () => {
            if (props.onChange) {
                props.onChange({
                    target: { value: '' },
                } as React.ChangeEvent<HTMLInputElement>);
            }
        };

        return (
            <div className="relative w-full" ref={ref}>
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10', // добавили padding справа для крестика
                        className,
                    )}
                    {...props}
                />
                {isFilled && <CrossButton fn={clearInput} />}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
