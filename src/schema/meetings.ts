import { startOfDay } from 'date-fns';
import { z } from 'zod';

const meetingSchemaBase = z.object({
    startTime: z.date().min(new Date()),
    guestEmail: z.string().email().min(1, 'Обязательное поле'),
    guestName: z.string().min(1, 'Обязательное поле'),
    guestNotes: z.string().optional(),
    timezone: z.string().min(1, 'Обязательное поле'),
});

export const meetingFormSchema = z
    .object({
        date: z.date().min(startOfDay(new Date()), 'Должно быть в будущем'),
    })
    .merge(meetingSchemaBase);

export const meetingActionSchema = z
    .object({
        eventId: z.string().min(1, 'Обязательное поле'),
        clerkUserId: z.string().min(1, 'Обязательное поле'),
    })
    .merge(meetingSchemaBase);
