import { db } from '@/drizzle/db';
import { auth } from '@clerk/nextjs/server';
import { Events } from './_components/Events';

export const revalidate = 0;

export default async function EventsPage() {
    const { userId, redirectToSignIn } = auth();

    if (userId == null) return redirectToSignIn();

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    });

    return (
        <>
            <Events events={events} />
        </>
    );
}
