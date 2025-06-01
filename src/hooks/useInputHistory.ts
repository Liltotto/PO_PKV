import { useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { useInputHistoryStore } from '@/store/InputHistoryStore';

export const useInputHistory = (inputValue: string) => {
    const inputHistory = useInputHistoryStore((state) => state.inputHistory);
    const addToInputHistory = useInputHistoryStore(
        (state) => state.addToInputHistory,
    );

    const debouncedValue = useDebounce(inputValue, 2000);

    useEffect(() => {
        const handleItemsChange = (inputValue: string) => {
            addToInputHistory(inputValue);
        };

        if (debouncedValue) {
            handleItemsChange(debouncedValue);
        }
    }, [debouncedValue]);

    return { inputHistory };
};
