import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { runQuery } from "../../../sanity/groqd";
import EventList from "../../../components/EventList";
import { Suspense } from "react";
import { archivedEventsQuery, upcomingEventsQuery } from "../../../sanity/queries/events";

type Params = {
  locale: string;
};
type SearchParams = {
  region?: string;
};
export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const { region } = await searchParams;
  const parameters = {
    locale,
    limit: 10,
    currentDate: new Date().toISOString(),
    regionSlug: region || null,
  };
  const upcomingEvents = runQuery(upcomingEventsQuery, {
    parameters,
  });
  const archivedEvents = runQuery(archivedEventsQuery, { parameters });
  return (
    <div className="flex flex-col">
      <h2 className="text-4xl">Wydarzenia</h2>

      <Tabs defaultValue="upcoming" className="self-center w-sm md:w-lg lg:w-xl xl:w-3xl">
        <TabsList>
          <TabsTrigger value="upcoming">Nadchodzące</TabsTrigger>
          <TabsTrigger value="archived">Archiwum</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Suspense fallback={<div>Loading...</div>}>
            <EventList events={upcomingEvents} locale={locale} />
          </Suspense>
        </TabsContent>
        <TabsContent value="archived">
          <EventList events={archivedEvents} locale={locale} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
