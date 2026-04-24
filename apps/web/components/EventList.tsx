import React from "react";
import type { EventPreview } from "../sanity/queries/events";
import EventPreviewDisplay from "./EventPreview";

type Props = {
  events: Promise<Array<EventPreview>>;
  locale: string;
};

async function EventList({ events, locale }: Props) {
  const resolvedEvents = await events;
  return (
    <div className="flex flex-col gap-4">
      {resolvedEvents.map((e) => (
        <EventPreviewDisplay key={e._id} event={e} locale={locale} />
      ))}
    </div>
  );
}

export default EventList;
