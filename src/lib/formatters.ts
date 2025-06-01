export function formatEventDescription(durationInMinutes: number) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const minutesString = `${minutes} ${minutes > 1 ? 'mins' : 'min'}`;
    const hoursString = `${hours} ${hours > 1 ? 'hrs' : 'hr'}`;

    if (hours === 0) return minutesString;
    if (minutes === 0) return hoursString;
    return `${hoursString} ${minutesString}`;
}

export function formatTimezoneOffset(timezone: string): string | undefined {
    try {
        const formatter = new Intl.DateTimeFormat(undefined, {
            timeZone: timezone,
            timeZoneName: 'shortOffset',
        });

        const parts = formatter.formatToParts(new Date());
        const tzPart = parts.find(
            (part) => part.type === 'timeZoneName'
        )?.value;

        // Нормализуем формат к GMT±HH:MM
        if (!tzPart) return undefined;

        return tzPart.replace(
            /^GMT([+-])(\d{1,2})(\d{2})?$/,
            (_, sign, hours, minutes) =>
                `GMT${sign}${hours.padStart(2, '0')}:${minutes || '00'}`
        );
    } catch (e) {
        return undefined;
    }
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

export function formatDate(date: Date) {
    return dateFormatter.format(date);
}

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
});

export function formatTimeString(date: Date) {
    return timeFormatter.format(date);
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export function formatDateTime(date: Date) {
    return dateTimeFormatter.format(date);
}
