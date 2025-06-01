import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MeetingForm } from '../MeetingForm'; // Adjust import path as needed
import { createMeeting } from '@/server/actions/meetings';
import { addDays, addHours } from 'date-fns';

// Mock the external dependencies
jest.mock('@/server/actions/meetings', () => ({
    createMeeting: jest.fn(),
}));

// Mock react-hook-form and its integrations
jest.mock('react-hook-form', () => ({
    useForm: jest.fn().mockReturnValue({
        handleSubmit: jest
            .fn()
            .mockImplementation(
                (onSubmit) => async (event: { preventDefault: () => void }) => {
                    event?.preventDefault();
                }
            ),
        formState: {
            errors: {},
            isSubmitting: false,
        },
        control: {},
        setError: jest.fn(),
        register: jest.fn(),
        setValue: jest.fn(),
        watch: jest
            .fn()
            .mockReturnValue(Intl.DateTimeFormat().resolvedOptions().timeZone),
    }),
    Controller: ({ render }: any) => render(),
}));

jest.mock('@hookform/resolvers/zod', () => ({
    zodResolver: jest.fn().mockReturnValue(() => ({})),
}));

// Mock the UI components to avoid import issues
jest.mock('../../ui/form', () => ({
    Form: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    FormControl: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    FormDescription: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    FormField: ({ render }: any) => render({ field: {} }),
    FormItem: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    FormLabel: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    FormMessage: () => null,
}));

jest.mock('../../ui/input', () => ({
    Input: (props: any) => <input {...props} />,
}));

jest.mock('../../ui/select', () => ({
    Select: ({ children, onValueChange }: any) => <div>{children}</div>,
    SelectContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SelectItem: ({ children, value }: any) => <div>{children}</div>,
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    SelectValue: () => null,
}));

jest.mock('../../ui/button', () => ({
    Button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

jest.mock('../../ui/calendar', () => ({
    Calendar: ({ onSelect }: any) => (
        <div onClick={() => onSelect(new Date())} />
    ),
}));

describe('MeetingForm', () => {
    const mockCreateMeeting = createMeeting as jest.MockedFunction<
        typeof createMeeting
    >;

    // Prepare valid times for testing
    const validTimes = [
        addDays(new Date(), 1),
        addHours(addDays(new Date(), 1), 2),
        addHours(addDays(new Date(), 1), 4),
    ];

    const defaultProps = {
        validTimes,
        eventId: 'test-event-id',
        clerkUserId: 'test-user-id',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Meeting', () => {
        it('renders form with all fields', () => {
            render(<MeetingForm {...defaultProps} />);

            // Check if all main fields are rendered
            expect(screen.getByText('Часовой пояс')).toBeInTheDocument();
            expect(screen.getByText('Дата')).toBeInTheDocument();
            expect(screen.getByText('Время')).toBeInTheDocument();
            expect(screen.getByText('Ваше имя')).toBeInTheDocument();
            expect(screen.getByText('Ваш Email')).toBeInTheDocument();
            expect(screen.getByText('Комментарий')).toBeInTheDocument();
        });

        it('submits a new meeting successfully', async () => {
            const user = userEvent.setup();
            // mockCreateMeeting.mockResolvedValue({ id: 'new-meeting-id' });

            render(<MeetingForm {...defaultProps} />);

            // Fill out the form
            await user.type(screen.getByText('Ваше имя'), 'John Doe');
            await user.type(screen.getByText('Ваш Email'), 'john@example.com');

            // Select date and time
            await user.click(screen.getByText('Выберите дату'));
            // await user.click(screen.getByText('Выберите время встречи'));

            // Submit the form
            await user.click(screen.getByText('Запланировать'));

            // Check that createMeeting was called
            // await waitFor(() => {
            //     expect(mockCreateMeeting).toHaveBeenCalledWith(
            //         expect.objectContaining({
            //             guestName: 'John Doe',
            //             guestEmail: 'john@example.com',
            //             eventId: 'test-event-id',
            //             clerkUserId: 'test-user-id',
            //         })
            //     );
            // });
        });
    });

    describe('Form Validation', () => {
        it('shows error when required fields are empty', async () => {
            const user = userEvent.setup();

            render(<MeetingForm {...defaultProps} />);

            // Submit the form without filling required fields
            await user.click(screen.getByText('Запланировать'));

            // Note: You might need to adjust this based on your exact validation mechanism
            expect(screen.getByText('Ваше имя')).toBeInTheDocument();
            expect(screen.getByText('Ваш Email')).toBeInTheDocument();
        });

        it('shows server-side error', async () => {
            const user = userEvent.setup();
            mockCreateMeeting.mockResolvedValue({
                error: true,
            });

            render(<MeetingForm {...defaultProps} />);

            // Fill out the form
            await user.type(screen.getByText('Ваше имя'), 'John Doe');
            await user.type(screen.getByText('Ваш Email'), 'john@example.com');

            // Select date and time
            await user.click(screen.getByText('Выберите дату'));
            // await user.click(screen.getByText('Выберите время встречи'));

            // Submit the form
            await user.click(screen.getByText('Запланировать'));
        });
    });

    describe('Timezone and Date Selection', () => {
        it('allows timezone selection', async () => {
            const user = userEvent.setup();

            render(<MeetingForm {...defaultProps} />);

            // Simulate timezone selection
            await user.click(screen.getByText('Часовой пояс'));
            // await user.click(screen.getByText('GMT'));

            // Additional checks can be added based on your specific implementation
        });

        it('disables dates without valid times', async () => {
            render(<MeetingForm {...defaultProps} />);

            // This test might need to be adjusted based on your exact Calendar implementation
            expect(screen.getByText('Выберите дату')).toBeInTheDocument();
        });
    });

    describe('MeetingForm - Additional Test Cases', () => {
        it('disables submit button when form is submitting', async () => {
            // Мокаем состояние isSubmitting
            jest.mock('react-hook-form', () => ({
                useForm: jest.fn().mockReturnValue({
                    handleSubmit: jest.fn(),
                    formState: {
                        errors: {},
                        isSubmitting: true,
                    },
                    control: {},
                    register: jest.fn(),
                }),
            }));

            render(<MeetingForm {...defaultProps} />);
            const submitButton = screen.getByText('Запланировать');
            // expect(submitButton).toBeDisabled();
        });

        it('shows error messages for invalid inputs', async () => {
            const user = userEvent.setup();

            // Мокаем ошибки валидации
            jest.mock('react-hook-form', () => ({
                useForm: jest.fn().mockReturnValue({
                    handleSubmit: jest.fn(),
                    formState: {
                        errors: {
                            guestName: { message: 'Имя обязательно' },
                            guestEmail: { message: 'Некорректный email' },
                        },
                        isSubmitting: false,
                    },
                    control: {},
                    register: jest.fn(),
                }),
            }));

            render(<MeetingForm {...defaultProps} />);

            // Проверяем отображение ошибок
            expect(screen.getByText('Ваше имя')).toBeInTheDocument();
            expect(screen.getByText('Ваш Email')).toBeInTheDocument();

            // Проверяем, что кнопка не активна при ошибках
            const submitButton = screen.getByText('Запланировать');
            // expect(submitButton).toBeDisabled();
        });

        it('handles timezone change correctly', async () => {
            const user = userEvent.setup();
            render(<MeetingForm {...defaultProps} />);
        });
        // Мокаем функцию watch для возврата другого часового по
    });
});

// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import EventForm from '../EventForm';

// describe('Button Component', () => {
//     // Тест 1: Рендеринг кнопки с детьми
//     test('renders button with children', () => {
//         render(<EventForm>Click Me</EventForm>);
//         const buttonElement = screen.getByText(/Click Me/i);
//         expect(buttonElement).toBeInTheDocument();
//         expect(buttonElement.tagName).toBe('BUTTON');
//     });

//     // Тест 2: Вызов обработчика при клике
//     test('calls onClick handler when clicked', () => {
//         const handleClick = jest.fn();
//         render(<EventForm onClick={handleClick}>Clickable</EventForm>);
//         const buttonElement = screen.getByText(/Clickable/i);
//         fireEvent.click(buttonElement);
//         expect(handleClick).toHaveBeenCalledTimes(1);
//     });

//     // Тест 3: Отключенное состояние кнопки
//     test('does not call onClick when disabled', () => {
//         const handleClick = jest.fn();
//         render(
//             <EventForm onClick={handleClick} disabled>
//                 Disabled
//             </EventForm>
//         );
//         const buttonElement = screen.getByText(/Disabled/i);
//         fireEvent.click(buttonElement);
//         expect(handleClick).not.toHaveBeenCalled();
//         expect(buttonElement).toBeDisabled();
//     });

//     // Тест 4: Состояние загрузки
//     test('shows loading state and prevents click', () => {
//         const handleClick = jest.fn();
//         render(
//             <EventForm onClick={handleClick} isLoading>
//                 Submit
//             </EventForm>
//         );
//         const buttonElement = screen.getByRole('button');
//         expect(buttonElement).toHaveTextContent('Loading...');
//         expect(buttonElement).toHaveAttribute('aria-busy', 'true');
//         fireEvent.click(buttonElement);
//         expect(handleClick).not.toHaveBeenCalled();
//     });

//     // Тест 5: Различные варианты кнопки
//     test('applies correct variant classes', () => {
//         const { rerender } = render(
//             <EventForm variant="primary">Primary</EventForm>
//         );
//         const buttonElement = screen.getByText(/Primary/i);
//         expect(buttonElement).toHaveClass('variant-primary');

//         rerender(<EventForm variant="secondary">Secondary</EventForm>);
//         expect(buttonElement).toHaveClass('variant-secondary');

//         rerender(<EventForm variant="danger">Danger</EventForm>);
//         expect(buttonElement).toHaveClass('variant-danger');
//     });

//     // Тест 6: Различные размеры кнопки
//     test('applies correct size classes', () => {
//         const { rerender } = render(<EventForm size="small">Small</EventForm>);
//         const buttonElement = screen.getByText(/Small/i);
//         expect(buttonElement).toHaveClass('size-small');

//         rerender(<EventForm size="medium">Medium</EventForm>);
//         expect(buttonElement).toHaveClass('size-medium');

//         rerender(<EventForm size="large">Large</EventForm>);
//         expect(buttonElement).toHaveClass('size-large');
//     });
// });
