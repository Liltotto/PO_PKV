export interface Event {
    id: string;
    isActive: boolean;
    name: string;
    description: string | null;
    durationInMinutes: number;
    clerkUserId: string;
}
