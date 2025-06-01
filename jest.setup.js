// jest.setup.js
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { TextDecoder, TextEncoder } from 'util';

// Make jest globally available
global.jest = jest;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Мокаем React hooks and modules
jest.mock('react', () => {
    const originalModule = jest.requireActual('react');
    return {
        ...originalModule,
        useTransition: jest.fn(() => [jest.fn(), false]),
        useState: jest.fn((initialState) => [initialState, jest.fn()]),
    };
});

jest.mock('react-hook-form', () => {
    const originalModule = jest.requireActual('react-hook-form');
    return {
        ...originalModule,
        useForm: jest.fn(() => ({
            handleSubmit: jest.fn((callback) => (event) => {
                event?.preventDefault();
                return callback();
            }),
            control: {},
            register: jest.fn(),
            formState: {
                errors: {},
                isSubmitting: false,
            },
            setError: jest.fn(),
        })),
    };
});

// Мокаем Next.js navigation hooks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    })),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock other common libraries
jest.mock('react-hook-form', () => ({
    useForm: jest.fn(),
    Controller: jest.fn(),
}));

// Global error and warn mocks
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};
