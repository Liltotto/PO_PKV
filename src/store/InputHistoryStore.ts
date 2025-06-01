import { create } from 'zustand';

type InputHistoryStore = {
    inputHistory: string[];
    setInputHistory: (inputHistory: string[]) => void;
    addToInputHistory: (value: string) => void;
    removeFromInputHistory: (value: string) => void;
};

const getInputHistory = (): string[] => {
    if (typeof localStorage === 'undefined') {
        return [];
    }
    try {
        const inputHistory = localStorage.getItem('input_history');
        return inputHistory ? JSON.parse(inputHistory) : [];
    } catch (error) {
        console.error(
            'Failed to parse input history from localStorage:',
            error,
        );
        return [];
    }
};

const setInputHistoryInLocalStorage = (inputHistory: string[]) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('input_history', JSON.stringify(inputHistory));
    }
};

export const useInputHistoryStore = create<InputHistoryStore>((set, get) => ({
    inputHistory: getInputHistory(),
    setInputHistory: (inputHistory) => {
        set({ inputHistory });
        setInputHistoryInLocalStorage(inputHistory);
    },
    addToInputHistory: (value) => {
        const { inputHistory } = get();
        if (!inputHistory.includes(value)) {
            if (inputHistory.length > 20) {
                const newInputHistory = [...inputHistory.slice(1), value];
                set({ inputHistory: newInputHistory });
                setInputHistoryInLocalStorage(newInputHistory);
                return;
            }
            const newInputHistory = [...inputHistory, value];
            set({ inputHistory: newInputHistory });
            setInputHistoryInLocalStorage(newInputHistory);
        }
    },
    removeFromInputHistory: (value) => {
        const { inputHistory } = get();
        const newInputHistory = inputHistory.filter((item) => item !== value);
        set({ inputHistory: newInputHistory });
        setInputHistoryInLocalStorage(newInputHistory);
    },
}));
