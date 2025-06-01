// @flow
import * as React from 'react';
import { CrossButton } from '../ui/cross-button';
import { useInputHistoryStore } from '@/store/InputHistoryStore';
import { useSearchStore } from '@/store/SearchStore';

export const DropdownItem = ({ value }: { value: string }) => {
    const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
    const removeFromInputHistory = useInputHistoryStore(
        (state) => state.removeFromInputHistory,
    );
    return (
        <div
            onClick={() => setSearchQuery(value)}
            className="relative hover:bg-slate-200 cursor-pointer flex w-full justify-between border-b last:border-b-0 items-center py-3 pl-3 pr-11"
        >
            <div className="truncate">{value}</div>
            <CrossButton fn={() => removeFromInputHistory(value)} />
        </div>
    );
};
