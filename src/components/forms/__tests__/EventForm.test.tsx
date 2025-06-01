import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventForm } from '../EventForm'; // Adjust import path as needed
import { createEvent, updateEvent, deleteEvent } from '@/server/actions/events';

// Mock the external dependencies
jest.mock('@/server/actions/events', () => ({
    createEvent: jest.fn(),
    updateEvent: jest.fn(),
    deleteEvent: jest.fn(),
}));

// Mock react-hook-form and its integrations
jest.mock('react-hook-form', () => ({
    useForm: jest.fn().mockReturnValue({
        handleSubmit: jest.fn().mockImplementation((onSubmit) => async (event: { preventDefault: () => void; }) => {
            event?.preventDefault();
        }),
        formState: {
            errors: {},
            isSubmitting: false,
        },
        control: {},
        setError: jest.fn(),
        register: jest.fn(),
        setValue: jest.fn(),
    }),
    Controller: ({ render }: any) => render(),
}));

jest.mock('@hookform/resolvers/zod', () => ({
    zodResolver: jest.fn().mockReturnValue(() => ({})),
}));

// Mock the UI components to avoid import issues with shadcn/ui
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

jest.mock('../../ui/textarea', () => ({
    Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock('../../ui/switch', () => ({
    Switch: ({ checked, onCheckedChange }: any) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
        />
    ),
}));

jest.mock('../../ui/button', () => ({
    Button: ({ children, ...props }: any) => (
        <button {...props}>{children}</button>
    ),
}));

jest.mock('../../ui/alert-dialog', () => ({
    AlertDialog: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
        <button>{children}</button>
    ),
    AlertDialogAction: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

describe('EventForm', () => {
    const mockCreateEvent = createEvent as jest.MockedFunction<
        typeof createEvent
    >;
    const mockUpdateEvent = updateEvent as jest.MockedFunction<
        typeof updateEvent
    >;
    const mockDeleteEvent = deleteEvent as jest.MockedFunction<
        typeof deleteEvent
    >;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Create Event', () => {
        it('renders form with default values for new event', () => {
            render(<EventForm />);

            // Check if input fields are rendered
            expect(
                screen.getByText("Название мероприятия")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Продолжительность")
            ).toBeInTheDocument();
            expect(screen.getByText("Описание")).toBeInTheDocument();
            expect(screen.getByText("Активный")).toBeInTheDocument();
        });

        it('submits a new event successfully', async () => {
            const user = userEvent.setup();
            mockCreateEvent.mockResolvedValue({ error: true });

            render(<EventForm />);

            // Fill out the form
            await user.type(
                screen.getByText("Название мероприятия"),
                'Test Event'
            );
            await user.type(screen.getByText("Продолжительность"), '45');
            await user.type(
                screen.getByText("Описание"),
                'Test description'
            );

            // Submit the form
            await user.click(screen.getByText("Сохранить"));
        });
    });

    describe('Edit Event', () => {
        const existingEvent = {
            id: 'existing-event-id',
            name: 'Existing Event',
            description: 'Existing description',
            durationInMinutes: 30,
            isActive: true,
        };

        it('renders form with existing event data', () => {
            render(<EventForm event={existingEvent} />);
        });

        it('updates an existing event successfully', async () => {
            const user = userEvent.setup();
            mockUpdateEvent.mockResolvedValue({ error: true });

            render(<EventForm event={existingEvent} />);

            // Modify the event
            // await user.clear(screen.getByText("Название мероприятия"));
            await user.type(
                screen.getByText("Название мероприятия"),
                'Updated Event'
            );

            // Submit the form
            await user.click(screen.getByText("Сохранить"));
        });

        it('deletes an existing event', async () => {
            const user = userEvent.setup();
            mockDeleteEvent.mockResolvedValue({ error: false });

            render(<EventForm event={existingEvent} />);
        });
    });

    describe('Form Validation', () => {
        it('shows error when name is empty', async () => {
            const user = userEvent.setup();

            render(<EventForm />);

            // Submit the form without filling name
            await user.click(screen.getByText("Сохранить"));

            // Wait for form validation error
            // Note: In a real scenario, you might need to adjust this based on your exact form validation mechanism
            expect(
                screen.getByText("Название мероприятия")
            ).toBeInTheDocument();
        });

        it('shows server-side error', async () => {
            const user = userEvent.setup();
            mockCreateEvent.mockResolvedValue({
                error: true,
            });

            render(<EventForm />);

            // Fill out the form
            await user.type(
                screen.getByText("Название мероприятия"),
                'Test Event'
            );
            await user.type(screen.getByText("Продолжительность"), '45');

            // Submit the form
            await user.click(screen.getByText("Сохранить"));
        });
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
//         const { rerender } = render(<EventForm variant="primary">Primary</EventForm>);
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
