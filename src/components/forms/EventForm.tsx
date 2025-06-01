'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema } from '@/schema/events';
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
import { Switch } from '../ui/switch';
import { createEvent, deleteEvent, updateEvent } from '@/server/actions/events';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '../ui/alert-dialog';
import { useState, useTransition } from 'react';

export function EventForm({
    event,
}: {
    event?: {
        id: string;
        name: string;
        description?: string;
        durationInMinutes: number;
        isActive: boolean;
    };
}) {
    const [isDeletePending, startDeleteTransition] = useTransition();
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ?? {
            isActive: true,
            durationInMinutes: 30,
        },
    });

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action =
            event == null ? createEvent : updateEvent.bind(null, event.id);
        const data = await action(values);

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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название мероприятия</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                Имя, которое пользователи увидят при
                                бронировании
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Продолжительность</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>В минутах</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                                <Textarea
                                    className="resize-none h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Необязательное описание события
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Активный</FormLabel>
                            </div>
                            <FormDescription>
                                Неактивные события не будут видны пользователям
                                для бронирования
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <div className="flex gap-2 justify-end">
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructiveGhost"
                                    disabled={
                                        isDeletePending ||
                                        form.formState.isSubmitting
                                    }
                                >
                                    Удалить
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Вы уверены?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Это действие нельзя отменить. Это
                                        навсегда удалит ваше событие.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Отмена
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        disabled={
                                            isDeletePending ||
                                            form.formState.isSubmitting
                                        }
                                        variant="destructive"
                                        onClick={() => {
                                            startDeleteTransition(async () => {
                                                const data = await deleteEvent(
                                                    event.id
                                                );

                                                if (data?.error) {
                                                    form.setError('root', {
                                                        message:
                                                            'There was an error deleting your event',
                                                    });
                                                }
                                            });
                                        }}
                                    >
                                        Удалить
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <Button
                        disabled={
                            isDeletePending || form.formState.isSubmitting
                        }
                        type="button"
                        asChild
                        variant="outline"
                    >
                        <Link href="/events">Отмена</Link>
                    </Button>
                    <Button
                        disabled={
                            isDeletePending || form.formState.isSubmitting
                        }
                        type="submit"
                    >
                        Сохранить
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

// const EventForm: React.FC<ButtonProps> = ({
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

// export default EventForm;