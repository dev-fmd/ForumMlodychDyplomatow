import { runQuery } from "../../sanity/groqd";
import { eventsPaginatedQuery, type EventPreview } from "../../sanity/queries/events";
import type { PageBuilderSectionProps } from "../../sanity/queries/pageBuilder";
import type { PaginationQueryFunction, PaginationResult } from "../../sanity/queries/pagination";
import { type Filter, type FilterParams } from "../List/FilterList";
import { EventsFilterList } from "../List/instances/EventsFilterList";
import { Container } from "../ui/container";

const getEventsAction: PaginationQueryFunction<
  EventPreview,
  FilterParams<{ location: string[]; type: "archive" | "upcoming" }>
> = async (params) => {
  "use server";

  const res = await runQuery(
    eventsPaginatedQuery({
      page: params.page ?? 1,
      perPage: params.perPage ?? 4,
      archive: params.filters?.type === "archive",
    }),
    {
      parameters: {
        locale: params.locale,
        location: (params.filters?.location as string[] | null) ?? null,
        name: params.q ? `*${params.q}*` : null,
        type: params.filters?.type ?? "upcoming",
      },
    }
  );
  return res.data as PaginationResult<EventPreview>;
};

export const EventsListSection = async ({
  data,
  locale,
}: PageBuilderSectionProps<"eventsListSection">) => {
  const filters: Filter[] = [
    {
      slug: "location",
      multiple: true,
      maxSelection: 2,
      options: [
        {
          label: "Online",
          value: "online",
        },
        ...((data.divisions.filter((d) => d.label && d.value) as Array<{
          label: string;
          value: string;
        }>) ?? []),
      ],
    },
  ];

  return (
    <Container className="flex flex-col gap-8" contentWidth="max">
      <EventsFilterList
        filters={filters}
        queryAction={getEventsAction}
        locale={locale}
        perPage={4}
      />
    </Container>
  );
};
