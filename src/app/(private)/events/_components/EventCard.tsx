import { CopyEventButton } from '@/components/CopyEventButton';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatEventDescription } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type EventCardProps = {
    id: string;
    isActive: boolean;
    name: string;
    description: string | null;
    durationInMinutes: number;
    clerkUserId: string;
};

export function EventCard({
    id,
    isActive,
    name,
    description,
    durationInMinutes,
    clerkUserId,
}: EventCardProps) {
    return (
        <Card
            className={cn('flex flex-col', !isActive && 'border-secondary/50')}
        >
            <CardHeader className={cn(!isActive && 'opacity-50')}>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {formatEventDescription(durationInMinutes)}
                </CardDescription>
            </CardHeader>
            {description != null && (
                <CardContent className={cn(!isActive && 'opacity-50')}>
                    {description}
                </CardContent>
            )}
            <CardFooter className="flex justify-end gap-2 mt-auto">
                {isActive && (
                    <CopyEventButton
                        variant="outline"
                        eventId={id}
                        clerkUserId={clerkUserId}
                    />
                )}
                <Button asChild>
                    <Link href={`/events/${id}/edit`}>Редактировать</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
