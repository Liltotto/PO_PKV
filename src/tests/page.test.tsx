// import { render, screen } from '@testing-library/react';
// import { auth } from '@clerk/nextjs/server';
// import { redirect } from 'next/navigation';
// import HomePage from '@/app/page';

// // Mock Clerk и Next.js navigation
// jest.mock('@clerk/nextjs/server', () => ({
//     auth: jest.fn(),
// }));

// jest.mock('next/navigation', () => ({
//     redirect: jest.fn(),
// }));

// jest.mock('@clerk/nextjs', () => ({
//     SignInButton: ({ children }: { children: React.ReactNode }) => (
//         <div data-testid="sign-in-button">{children}</div>
//     ),
//     SignUpButton: ({ children }: { children: React.ReactNode }) => (
//         <div data-testid="sign-up-button">{children}</div>
//     ),
//     UserButton: () => <div data-testid="user-button" />,
// }));

// describe('HomePage', () => {
//     const mockAuth = auth as jest.MockedFunction<typeof auth>;
//     const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     it('redirects to /events if user is authenticated', () => {
//         // Мокаем авторизованного пользователя
//         mockAuth.mockReturnValue({ userId: 'user123' } as any);

//         render(<HomePage />);

//         expect(mockRedirect).toHaveBeenCalledWith('/events');
//     });

//     it('renders homepage with auth buttons for unauthenticated user', () => {
//         // Мокаем неавторизованного пользователя
//         mockAuth.mockReturnValue({ userId: null } as any);

//         render(<HomePage />);

//         // Проверяем основные элементы
//         expect(screen.getByText('Главная страница')).toBeInTheDocument();
//         expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
//         expect(screen.getByTestId('sign-up-button')).toBeInTheDocument();
//         expect(screen.getByTestId('user-button')).toBeInTheDocument();
//     });

//     it('renders buttons with correct styling', () => {
//         mockAuth.mockReturnValue({ userId: null } as any);

//         render(<HomePage />);

//         const buttons = screen.getAllByRole('button');
//         expect(buttons).toHaveLength(3);
//         buttons.forEach((button) => {
//             expect(button).toHaveClass('flex');
//             expect(button).toHaveClass('gap-2');
//             expect(button).toHaveClass('justify-center');
//         });
//     });

//     it('has correct container styling', () => {
//         mockAuth.mockReturnValue({ userId: null } as any);

//         render(<HomePage />);

//         const container = screen.getByTestId('homepage-container');
//         expect(container).toHaveClass('text-center');
//         expect(container).toHaveClass('container');
//         expect(container).toHaveClass('my-4');
//         expect(container).toHaveClass('mx-auto');
//     });

//     it('displays correct heading', () => {
//         mockAuth.mockReturnValue({ userId: null } as any);

//         render(<HomePage />);

//         const heading = screen.getByRole('heading', { level: 1 });
//         expect(heading).toHaveTextContent('Главная страница');
//         expect(heading).toHaveClass('text-3xl');
//         expect(heading).toHaveClass('mb-4');
//     });
// });

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventForm from '@/app/page';

describe('Button Component', () => {
    // Тест 1: Рендеринг кнопки с детьми
    test('renders button with children', () => {
        render(<EventForm>Click Me</EventForm>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.tagName).toBe('BUTTON');
    });

    // Тест 2: Вызов обработчика при клике
    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<EventForm onClick={handleClick}>Clickable</EventForm>);
        const buttonElement = screen.getByText(/Clickable/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Тест 3: Отключенное состояние кнопки
    test('does not call onClick when disabled', () => {
        const handleClick = jest.fn();
        render(
            <EventForm onClick={handleClick} disabled>
                Disabled
            </EventForm>
        );
        const buttonElement = screen.getByText(/Disabled/i);
        fireEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalled();
        expect(buttonElement).toBeDisabled();
    });

    // Тест 4: Состояние загрузки
    test('shows loading state and prevents click', () => {
        const handleClick = jest.fn();
        render(
            <EventForm onClick={handleClick} isLoading>
                Submit
            </EventForm>
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveTextContent('Loading...');
        expect(buttonElement).toHaveAttribute('aria-busy', 'true');
        fireEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalled();
    });

    // Тест 5: Различные варианты кнопки
    test('applies correct variant classes', () => {
        const { rerender } = render(<EventForm variant="primary">Primary</EventForm>);
        const buttonElement = screen.getByText(/Primary/i);
        expect(buttonElement).toHaveClass('variant-primary');

        rerender(<EventForm variant="secondary">Secondary</EventForm>);
        expect(buttonElement).toHaveClass('variant-secondary');

        rerender(<EventForm variant="danger">Danger</EventForm>);
        expect(buttonElement).toHaveClass('variant-danger');
    });

    // Тест 6: Различные размеры кнопки
    test('applies correct size classes', () => {
        const { rerender } = render(<EventForm size="small">Small</EventForm>);
        const buttonElement = screen.getByText(/Small/i);
        expect(buttonElement).toHaveClass('size-small');

        rerender(<EventForm size="medium">Medium</EventForm>);
        expect(buttonElement).toHaveClass('size-medium');

        rerender(<EventForm size="large">Large</EventForm>);
        expect(buttonElement).toHaveClass('size-large');
    });
});
