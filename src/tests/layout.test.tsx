import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventForm from '@/app/layout';

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
        const { rerender } = render(
            <EventForm variant="primary">Primary</EventForm>
        );
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
