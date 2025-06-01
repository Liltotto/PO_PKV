// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { ScheduleForm } from '../ScheduleForm';
// import { saveSchedule } from '@/server/actions/schedule';
// import { DAYS_OF_WEEK_IN_ORDER } from '@/data/constants';

// // Mock server actions
// jest.mock('@/server/actions/schedule', () => ({
//     saveSchedule: jest.fn(),
// }));

// // Mock formatters
// jest.mock('@/lib/formatters', () => ({
//     formatTimezoneOffset: jest.fn(() => 'GMT-4'),
// }));

// // Mock react-hook-form
// const mockUseForm = {
//     handleSubmit: jest.fn((fn) => (e: any) => {
//         e?.preventDefault();
//         fn({});
//     }),
//     formState: {
//         errors: {},
//         isSubmitting: false,
//     },
//     control: {},
//     register: jest.fn(),
//     setError: jest.fn(),
//     watch: jest.fn(),
//     getValues: jest.fn(() => ({
//         timezone: 'America/New_York',
//         availabilities: [],
//     })),
// };

// const mockUseFieldArray = {
//     fields: [],
//     append: jest.fn(),
//     remove: jest.fn(),
// };

// jest.mock('react-hook-form', () => ({
//     ...jest.requireActual('react-hook-form'),
//     useForm: () => mockUseForm,
//     useFieldArray: () => mockUseFieldArray,
//     Controller: ({ render }: any) => render({ field: {} }),
// }));

// // Mock UI components
// jest.mock('../../ui/select', () => ({
//     Select: ({ children, onValueChange, value }: any) => (
//         <select onChange={(e) => onValueChange(e.target.value)} value={value}>
//             {children}
//         </select>
//     ),
//     SelectContent: ({ children }: any) => <div>{children}</div>,
//     SelectItem: ({ children, value }: any) => (
//         <option value={value}>{children}</option>
//     ),
//     SelectTrigger: ({ children }: any) => <div>{children}</div>,
//     SelectValue: () => null,
// }));

// describe('ScheduleForm', () => {
//     const mockSaveSchedule = saveSchedule as jest.MockedFunction<
//         typeof saveSchedule
//     >;

//     beforeEach(() => {
//         jest.clearAllMocks();
//         mockUseFieldArray.fields = [];
//     });

//     it('renders form with timezone selector', () => {
//         render(<ScheduleForm />);
//         expect(screen.getByLabelText('Часовой пояс')).toBeInTheDocument();
//     });

//     it('renders days of week with add buttons', () => {
//         render(<ScheduleForm />);
//         DAYS_OF_WEEK_IN_ORDER.forEach((day) => {
//             expect(screen.getByText(day.substring(0, 3))).toBeInTheDocument();
//             expect(
//                 screen.getByLabelText(`Add availability for ${day}`)
//             ).toBeInTheDocument();
//         });
//     });

//     it('allows adding new availability slots', async () => {
//         const user = userEvent.setup();
//         render(<ScheduleForm />);

//         await user.click(screen.getByLabelText('Add availability for monday'));
//         expect(mockUseFieldArray.append).toHaveBeenCalledWith({
//             dayOfWeek: 'monday',
//             startTime: '9:00',
//             endTime: '17:00',
//         });
//     });

//     it('allows removing availability slots', async () => {
//         const user = userEvent.setup();
//         mockUseFieldArray.fields = [{ id: '1', dayOfWeek: 'monday', index: 0 }];

//         render(<ScheduleForm />);
//         await user.click(
//             screen.getByLabelText('Remove availability 1 for monday')
//         );
//         expect(mockUseFieldArray.remove).toHaveBeenCalledWith(0);
//     });

//     it('shows success message on successful save', async () => {
//         const user = userEvent.setup();
//         mockSaveSchedule.mockResolvedValue({ success: true });

//         render(<ScheduleForm />);
//         await user.click(screen.getByText('Save'));

//         await waitFor(() => {
//             expect(screen.getByText('Schedule saved!')).toBeInTheDocument();
//         });
//     });

//     it('shows error message on failed save', async () => {
//         const user = userEvent.setup();
//         mockSaveSchedule.mockResolvedValue({ error: 'Server error' });

//         render(<ScheduleForm />);
//         await user.click(screen.getByText('Save'));

//         await waitFor(() => {
//             expect(
//                 screen.getByText('There was an error saving your schedule')
//             ).toBeInTheDocument();
//         });
//     });

//     it('displays existing schedule data when provided', () => {
//         const schedule = {
//             timezone: 'Europe/London',
//             availabilities: [
//                 { dayOfWeek: 'monday', startTime: '10:00', endTime: '12:00' },
//             ],
//         };

//         mockUseFieldArray.fields = [
//             { ...schedule.availabilities[0], id: '1', index: 0 },
//         ];
//         mockUseForm.getValues.mockReturnValue(schedule);

//         render(<ScheduleForm schedule={schedule} />);

//         expect(screen.getByDisplayValue('10:00')).toBeInTheDocument();
//         expect(screen.getByDisplayValue('12:00')).toBeInTheDocument();
//     });

//     it('disables submit button when submitting', () => {
//         mockUseForm.formState.isSubmitting = true;
//         render(<ScheduleForm />);
//         expect(screen.getByText('Save')).toBeDisabled();
//     });

//     it('shows validation errors for availability slots', () => {
//         mockUseForm.formState.errors = {
//             availabilities: [
//                 {
//                     startTime: { message: 'Invalid start time' },
//                     endTime: { message: 'Invalid end time' },
//                 },
//             ],
//         };

//         mockUseFieldArray.fields = [{ id: '1', dayOfWeek: 'monday', index: 0 }];

//         render(<ScheduleForm />);
//         expect(screen.getByText('Invalid start time')).toBeInTheDocument();
//         expect(screen.getByText('Invalid end time')).toBeInTheDocument();
//     });

//     it('groups availabilities by day of week', () => {
//         const schedule = {
//             timezone: 'UTC',
//             availabilities: [
//                 { dayOfWeek: 'monday', startTime: '09:00', endTime: '12:00' },
//                 { dayOfWeek: 'monday', startTime: '14:00', endTime: '18:00' },
//                 { dayOfWeek: 'tuesday', startTime: '10:00', endTime: '15:00' },
//             ],
//         };

//         mockUseFieldArray.fields = schedule.availabilities.map((a, i) => ({
//             ...a,
//             id: `${i}`,
//             index: i,
//         }));
//         mockUseForm.getValues.mockReturnValue(schedule);

//         render(<ScheduleForm schedule={schedule} />);

//         expect(screen.getAllByLabelText(/monday.*Start Time/)).toHaveLength(2);
//         expect(
//             screen.getByLabelText(/tuesday.*Start Time/)
//         ).toBeInTheDocument();
//     });
// });

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScheduleForm from '../ScheduleForm';

describe('Button Component', () => {
    // Тест 1: Рендеринг кнопки с детьми
    test('renders button with children', () => {
        render(<ScheduleForm>Click Me</ScheduleForm>);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement.tagName).toBe('BUTTON');
    });

    // Тест 2: Вызов обработчика при клике
    test('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<ScheduleForm onClick={handleClick}>Clickable</ScheduleForm>);
        const buttonElement = screen.getByText(/Clickable/i);
        fireEvent.click(buttonElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // // Тест 3: Отключенное состояние кнопки
    // test('does not call onClick when disabled', () => {
    //     const handleClick = jest.fn();
    //     render(
    //         <EventForm onClick={handleClick} disabled>
    //             Disabled
    //         </EventForm>
    //     );
    //     const buttonElement = screen.getByText(/Disabled/i);
    //     fireEvent.click(buttonElement);
    //     expect(handleClick).not.toHaveBeenCalled();
    //     expect(buttonElement).toBeDisabled();
    // });

    // Тест 4: Состояние загрузки
    test('shows loading state and prevents click', () => {
        const handleClick = jest.fn();
        render(
            <ScheduleForm onClick={handleClick} isLoading>
                Submit
            </ScheduleForm>
        );
        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toHaveTextContent('Loading...');
        expect(buttonElement).toHaveAttribute('aria-busy', 'true');
        fireEvent.click(buttonElement);
        expect(handleClick).not.toHaveBeenCalled();
    });

    // Тест 5: Различные варианты кнопки
    test('applies correct variant classes', () => {
        const { rerender } = render(<ScheduleForm variant="primary">Primary</ScheduleForm>);
        const buttonElement = screen.getByText(/Primary/i);
        expect(buttonElement).toHaveClass('variant-primary');

        rerender(<ScheduleForm variant="secondary">Secondary</ScheduleForm>);
        expect(buttonElement).toHaveClass('variant-secondary');

        rerender(<ScheduleForm variant="danger">Danger</ScheduleForm>);
        expect(buttonElement).toHaveClass('variant-danger');
    });

    // Тест 6: Различные размеры кнопки
    test('applies correct size classes', () => {
        const { rerender } = render(<ScheduleForm size="small">Small</ScheduleForm>);
        const buttonElement = screen.getByText(/Small/i);
        expect(buttonElement).toHaveClass('size-small');

        rerender(<ScheduleForm size="medium">Medium</ScheduleForm>);
        expect(buttonElement).toHaveClass('size-medium');

        rerender(<ScheduleForm size="large">Large</ScheduleForm>);
        expect(buttonElement).toHaveClass('size-large');
    });
});

