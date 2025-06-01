import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useSearchStore } from '@/store/SearchStore';

export function useSearch<T>(items: T[], getKey: (item: T) => string) {
    const searchQuery = useSearchStore((state) => state.searchQuery);
    const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

    const debouncedValue = useDebounce(searchQuery);

    const filteredItems = useMemo(
        () =>
            items.filter((item) =>
                getKey(item)
                    .toLowerCase()
                    .includes(debouncedValue.toLowerCase()),
            ),
        [debouncedValue],
    );

    return { searchQuery, setSearchQuery, filteredItems };
}
