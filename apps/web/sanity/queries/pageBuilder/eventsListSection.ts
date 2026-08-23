import { q } from "@/sanity/groqd";
import type { PageBuilderSection } from ".";
import { type Locale } from "../intl";

export const eventsListSectionFragment = q
  .parameters<{ locale: Locale }>()
  .fragment<PageBuilderSection<"eventsListSection">>()
  .project((sub) => ({
    divisions: sub.star
      .filterByType("division")
      .filterBy("locale == $locale")
      .filterRaw("defined(name) && defined(slug.current)")
      .project((sub) => ({
        label: sub.field("name"),
        sortName: sub.coalesce(sub.field("sortName"), sub.field("name")),
        value: sub.field("slug.current"),
      }))
      .order("sortName asc"),
  }));
