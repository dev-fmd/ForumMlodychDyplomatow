import React from "react";
import { type EventPreview } from "../sanity/queries/events";

type Props = {
  event: EventPreview;
  locale: string;
};

const EventPreviewDisplay = ({ event, locale }: Props) => {
  const startDate = event.startDate ? new Date(event.startDate) : null;
  return (
    <div className="px-12 py-8 border border-gray-500">
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap">
          <h3 className="heading-3">{event.name}</h3>
          {startDate && (
            <>
              <span className="text-muted">
                {startDate.toLocaleString(locale, { dateStyle: "full", timeStyle: "short" })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPreviewDisplay;
