// components/List/instances/PublicationsFilterList.tsx
"use client";
import { type Locale } from "next-intl";
import { FilterList, type Filter, type FilterParams } from "../FilterList";
import type { PaginationQueryFunction } from "../../../sanity/queries/pagination";
import type { PublicationPreview } from "../../../sanity/queries/publications";
import { PublicationCard } from "@/components/ui/publication-card";

const Card = ({ item, locale }: { item: PublicationPreview; locale: Locale }) => {
  return <PublicationCard locale={locale} publication={item} />;
};

type Props = {
  filters: Filter[];
  queryAction: PaginationQueryFunction<PublicationPreview, FilterParams>;
  locale: Locale;
  perPage?: number;
};

export const PublicationsFilterList = ({ filters, queryAction, locale, perPage }: Props) => (
  <FilterList
    filters={filters}
    Component={Card}
    queryAction={queryAction}
    locale={locale}
    perPage={perPage}
    listClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
    type="publications"
  />
);
