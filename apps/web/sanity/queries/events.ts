import type { InferFragmentType } from "groqd";
import { q } from "../groqd";
import { imgFragment } from "./groqd.example";

export type EventsListQueryParams = {
  locale: string;
  regionSlug?: string | null;
  currentDate?: string | null;
  limit?: number;
};

export const DEFAULT_EVENTS_LIST_LIMIT = 6;

export const getEventsListQueryParams = ({
  locale,
  regionSlug = null,
  currentDate = new Date().toISOString(),
  limit = DEFAULT_EVENTS_LIST_LIMIT,
}: EventsListQueryParams) => ({
  locale,
  regionSlug,
  currentDate,
  limit,
});

export const eventPreviewFragment = q.fragmentForType<"event">().project((sub) => ({
  _id: true,
  name: true,
  startDate: true,
  endDate: true,
  excerpt: true,
  venue: true,
  image: sub.field("image").project(imgFragment),
  slug: "slug.current",
  region: sub.field("region").deref().project({
    _id: true,
    name: true,
    slug: "slug.current",
  }),
}));
export type EventPreview = InferFragmentType<typeof eventPreviewFragment>;
const baseEventsListQuery = ({
  timeFilterSign: tenseFilterSign,
  sortOrder,
}: {
  timeFilterSign: ">=" | "<";
  sortOrder: "asc" | "desc";
}) =>
  q
    .parameters<EventsListQueryParams>()
    .star.filterByType("event")
    .filterBy("locale == $locale")
    .filterRaw("!defined($regionSlug) || region->slug.current == $regionSlug")
    .filterRaw(
      `dateTime(coalesce(endDate, startDate)) ${tenseFilterSign} dateTime(coalesce($currentDate, now()))`
    )
    .order(`startDate ${sortOrder}`)
    .raw("[0...$limit]", "passthrough")
    .project(eventPreviewFragment);

export const upcomingEventsQuery = baseEventsListQuery({
  timeFilterSign: ">=",
  sortOrder: "asc",
});

export const archivedEventsQuery = baseEventsListQuery({
  timeFilterSign: "<",
  sortOrder: "desc",
});
