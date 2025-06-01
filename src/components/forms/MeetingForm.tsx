'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { meetingFormSchema } from '@/schema/meetings';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    formatDate,
    formatTimeString,
    formatTimezoneOffset,
} from '@/lib/formatters';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { createMeeting } from '@/server/actions/meetings';

export function MeetingForm({
    validTimes,
    eventId,
    clerkUserId,
}: {
    validTimes: Date[];
    eventId: string;
    clerkUserId: string;
}) {
    const form = useForm<z.infer<typeof meetingFormSchema>>({
        resolver: zodResolver(meetingFormSchema),
        defaultValues: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    });

    const timezone = form.watch('timezone');
    const date = form.watch('date');
    const validTimesInTimezone = useMemo(() => {
        return validTimes.map((date) => toZonedTime(date, timezone));
    }, [validTimes, timezone]);

    async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
        const data = await createMeeting({
            ...values,
            eventId,
            clerkUserId,
        });

        if (data?.error) {
            form.setError('root', {
                message: 'There was an error saving your event',
            });
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col"
            >
                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Часовой пояс</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Intl.supportedValuesOf('timeZone').map(
                                        (timezone) => (
                                            <SelectItem
                                                key={timezone}
                                                value={timezone}
                                            >
                                                {timezone}
                                                {` (${formatTimezoneOffset(
                                                    timezone
                                                )})`}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 flex-col md:flex-row">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <Popover>
                                <FormItem className="flex-1">
                                    <FormLabel>Дата</FormLabel>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'pl-3 text-left font-normal flex w-full',
                                                    !field.value &&
                                                        'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(field.value)
                                                ) : (
                                                    <span>Выберите дату</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                !validTimesInTimezone.some(
                                                    (time) =>
                                                        isSameDay(date, time)
                                                )
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                    <FormMessage />
                                </FormItem>
                            </Popover>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Время</FormLabel>
                                <Select
                                    disabled={date == null || timezone == null}
                                    onValueChange={(value) =>
                                        field.onChange(
                                            new Date(Date.parse(value))
                                        )
                                    }
                                    defaultValue={field.value?.toISOString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    date == null ||
                                                    timezone == null
                                                        ? 'Сначала выберите дату/часовой пояс'
                                                        : 'Выберите время встречи'
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {validTimesInTimezone
                                            .filter((time) =>
                                                isSameDay(time, date)
                                            )
                                            .map((time) => (
                                                <SelectItem
                                                    key={time.toISOString()}
                                                    value={time.toISOString()}
                                                >
                                                    {formatTimeString(time)}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                    <FormField
                        control={form.control}
                        name="guestName"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Ваше имя</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="guestEmail"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Ваш Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="guestNotes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Комментарий</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 justify-end">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="button"
                        asChild
                        variant="outline"
                    >
                        <Link href={`/book/${clerkUserId}`}>Отменить</Link>
                    </Button>
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >
                        Запланировать
                    </Button>
                </div>
            </form>
        </Form>
    );
}

// import React from 'react';
// import styles from './Button.module.css';

// interface ButtonProps {
//     children: React.ReactNode;
//     onClick?: () => void;
//     disabled?: boolean;
//     variant?: 'primary' | 'secondary' | 'danger';
//     size?: 'small' | 'medium' | 'large';
//     isLoading?: boolean;
// }

// const MeetingForm: React.FC<ButtonProps> = ({
//     children,
//     onClick,
//     disabled = false,
//     variant = 'primary',
//     size = 'medium',
//     isLoading = false,
// }) => {
//     const buttonClasses = [
//         styles.button,
//         styles[`variant-${variant}`],
//         styles[`size-${size}`],
//         disabled ? styles.disabled : '',
//         isLoading ? styles.loading : '',
//     ].join(' ');

//     return (
//         <button
//             className={buttonClasses}
//             onClick={onClick}
//             disabled={disabled || isLoading}
//             aria-busy={isLoading}
//         >
//             {isLoading ? 'Loading...' : children}
//         </button>
//     );
// };

// export default MeetingForm;