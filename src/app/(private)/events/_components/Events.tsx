'use client';

import { Button } from '@/components/ui/button';
import { useSearch } from '@/hooks/useSearch';
import { Event } from '@/types/events';
import { CalendarPlus, CalendarRange } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Search } from '@/components/_Search/Search';
import { EventCard } from './EventCard';
import { useInputHistory } from '@/hooks/useInputHistory';

export const Events = ({ events }: { events: Event[] }) => {
    const { filteredItems, searchQuery, setSearchQuery } = useSearch(
        events,
        (event) => event.name
    );
    const { inputHistory } = useInputHistory(searchQuery);

    return (
        <>
            <div className="flex gap-4 items-baseline justify-between">
                <div className="flex gap-4 items-baseline">
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
                        Мероприятие
                    </h1>
                    <Button asChild>
                        <Link href="/events/new">
                            <CalendarPlus className="mr-4 size-6" /> Новое
                            мероприятие
                        </Link>
                    </Button>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <Search
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        inputHistory={inputHistory}
                    />
                </div>
            </div>

            {events.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
                    {filteredItems.map((event) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <CalendarRange className="size-16 mx-auto" />У вас еще нет
                    никаких мероприятий. Создайте свое первое мероприятие, чтобы
                    начать!
                    <Button size="lg" className="text-lg" asChild>
                        <Link href="/events/new">
                            <CalendarPlus className="mr-4 size-6" /> Новое
                            мероприятие
                        </Link>
                    </Button>
                </div>
            )}
        </>
    );
};
