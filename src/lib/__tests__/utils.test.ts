import { cn, timeToInt } from '@/lib/utils';

describe('Utility Functions', () => {
    describe('cn() - className merger', () => {
        it('merges simple class strings', () => {
            expect(cn('class1', 'class2')).toBe('class1 class2');
        });

        it('handles conditional classes', () => {
            const isActive = true;
            const isDisabled = false;
            expect(
                cn('base', isActive && 'active', isDisabled && 'disabled')
            ).toBe('base active');
        });

        it('merges Tailwind classes correctly', () => {
            expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
            expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
        });

        it('handles empty inputs', () => {
            expect(cn()).toBe('');
            expect(cn('', null, undefined)).toBe('');
        });

        it('handles object syntax', () => {
            expect(cn({ 'bg-red-500': true, 'text-white': false })).toBe(
                'bg-red-500'
            );
        });

        it('handles arrays', () => {
            expect(cn(['class1', 'class2'], ['class3'])).toBe(
                'class1 class2 class3'
            );
        });
    });

    describe('timeToInt()', () => {
        it('converts time string to float number', () => {
            expect(timeToInt('12:30')).toBe(12.3);
            expect(timeToInt('09:45')).toBe(9.45);
            expect(timeToInt('00:15')).toBe(0.15);
        });

        it('handles times without leading zero', () => {
            expect(timeToInt('9:05')).toBe(9.05);
            expect(timeToInt('3:00')).toBe(3);
        });

        it('handles invalid inputs', () => {
            expect(timeToInt('invalid')).toBeNaN();
            expect(timeToInt('')).toBeNaN();
            // @ts-expect-error - testing invalid input
            expect(timeToInt(null)).toBeNaN();
        });
    });
});
