import { z } from 'zod';

export const eventFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    durationInMinutes: z.coerce
        .number()
        .int()
        .positive('Продолжительность должна быть больше 0')
        .max(
            60 * 12,
            `Продолжительность должна быть меньше 12 часов (${60 * 12} минут)`
        ),
});
