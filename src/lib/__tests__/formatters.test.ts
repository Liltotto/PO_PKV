import {
    formatEventDescription,
    formatTimezoneOffset,
    formatDate,
    formatTimeString,
    formatDateTime,
} from '../formatters'; // Укажите правильный путь

describe('DateTime Utility Functions', () => {
    describe('formatEventDescription', () => {
        it('formats minutes correctly', () => {
            expect(formatEventDescription(30)).toBe('30 mins');
            expect(formatEventDescription(1)).toBe('1 min');
        });

        it('formats hours correctly', () => {
            expect(formatEventDescription(60)).toBe('1 hr');
            expect(formatEventDescription(120)).toBe('2 hrs');
        });

        it('formats hours and minutes correctly', () => {
            expect(formatEventDescription(90)).toBe('1 hr 30 mins');
            expect(formatEventDescription(150)).toBe('2 hrs 30 mins');
        });
    });

    describe('formatTimezoneOffset', () => {
        it('returns timezone offset for valid timezone', () => {
            // Этот тест может быть хрупким, так как зависит от окружения
            const result = formatTimezoneOffset('America/New_York');
            expect(result).toMatch(/GMT([+-]\d{1,2}(:\d{2})?)/);
            // Альтернативно можно проверять конкретные возможные форматы
            expect(['GMT-4', 'GMT-04:00', 'GMT-0400']).toContain(result);
            
        });

        it('returns undefined for invalid timezone', () => {
            const result = formatTimezoneOffset('Invalid/Timezone');
            expect(result).toBeUndefined();
        });
    });

    describe('Date and Time Formatting', () => {
        const testDate = new Date('2023-05-15T14:30:00');

        it('formatDate formats date correctly', () => {
            // Результат зависит от локали, поэтому проверяем что возвращается строка
            const result = formatDate(testDate);
            expect(typeof result).toBe('string');
            expect(result).toContain('ма'); // Для en-US локали
        });

        it('formatTimeString formats time correctly', () => {
            const result = formatTimeString(testDate);
            expect(typeof result).toBe('string');
            expect(result).toMatch(/\d{1,2}:\d{2}/); // Для en-US локали
        });

        it('formatDateTime formats date and time correctly', () => {
            const result = formatDateTime(testDate);
            expect(typeof result).toBe('string');
            expect(result).toContain('ма'); // Для en-US локали
            expect(result).toMatch(/\d{1,2}:\d{2}/); // Для en-US локали
        });
    });
});
