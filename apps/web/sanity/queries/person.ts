import { type InferFragmentType } from "groqd";
import type { Locale } from "next-intl";
import { q } from "../groqd";
import { imgFragment } from "./imgFragment";
import type { PaginationParameters } from "./pagination";
import { intlArrayQuery } from "./intl";
import { socialsFragment } from "./socialsFragment";
export const personCardFragment = q
  .parameters<{ locale: Locale }>()
  .fragmentForType<"person">()
  .project((sub) => ({
    _id: true,

    name: true,
    title: intlArrayQuery(sub.field("title[]")),
    img: sub.field("img").project(imgFragment),
    socials: sub.field("socials[]").project(socialsFragment),
  }));
export type PersonCard = InferFragmentType<typeof personCardFragment>;
export const personFragment = q
  .parameters<{ locale: Locale; groups: string[] }>()
  .fragmentForType<"person">()
  .project((sub) => ({
    _id: true,
    name: true,
    title: sub.select({
      "$groups == null || group in $groups": intlArrayQuery(sub.field("title[]")),
      "secondaryGroup in $groups": intlArrayQuery(sub.field("secondaryTitle[]")),
    }),
    group: sub.select({
      "$groups == null || group in $groups": sub.field("group"),
      "secondaryGroup in $groups": sub.field("secondaryGroup"),
    }),
    img: sub.field("img").project(imgFragment),
    socials: sub.field("socials[]").project(socialsFragment),
  }));

export type PeoplePaginatedParameters = {
  locale: Locale;
  groups: string[] | null;
  name: string | null;
};

export const peoplePaginatedQuery = ({ page = 1, perPage = 10 }: PaginationParameters) =>
  q
    .parameters<PeoplePaginatedParameters>()
    .project((sub) => ({
      items: sub.star
        .filterByType("person")
        .filterRaw("$groups == null || group in $groups || secondaryGroup in $groups")
        .filterRaw("$name == null || name match $name")
        // typescript cast, since groqd doesn't support "defined(order)" syntax, but it's valid in sanity
        // This will sort defined order first, then all undefined orders
        .order("defined(order) desc" as any, "order asc", "name asc"),
    }))
    .project((sub) => ({
      total: sub.count("items[]"),
      page: sub.value(page),
      perPage: sub.value(perPage),
      items: sub
        .field("items[]")
        .project(personFragment)
        .slice((page - 1) * perPage, page * perPage),
    }));

export type PersonFull = InferFragmentType<typeof personFragment>;
