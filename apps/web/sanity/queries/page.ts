import { type InferResultType } from "groqd";
import { q } from "../groqd";
import { pageBuilderQueryFragment } from "./pageBuilder";
import { defaultSeoSettingsQuery, seoFragment } from "./seo";
import { LANGUAGE_FIELD } from "../../../studio/config";
import type { Locale } from "next-intl";
import { breadcrumbsFragment } from "./breadcrumbs";

export const pageQuery = q
  .parameters<{ slug: string; locale: string; divisionSlug: null }>()
  .star.filterByType("page")
  .filterBy("slug.current == $slug")
  .filterBy(`${LANGUAGE_FIELD} == $locale`)
  .slice(0)
  .project((sub) => ({
    _id: sub.field("_id"),
    _type: sub.field("_type"),
    name: sub.field("name"),
    slug: sub.field("slug.current"),
    breadcrumbs: sub.field("breadcrumbs[]").project(breadcrumbsFragment),
    pageBuilder: sub.field("pageBuilder[]").project(pageBuilderQueryFragment),
  }));

export type PageData = InferResultType<typeof pageQuery>;

export const pagesSlugQuery = q.star
  .filterByType("page")
  .filterRaw("defined(slug.current)")
  .project({
    slug: "slug.current",
    locale: "locale",
  });

export const pagesMetadataQuery = q
  .parameters<{ slug: string; locale: Locale }>()
  .star.filterByType("page")
  .filterBy("slug.current == $slug")
  .filterBy(`${LANGUAGE_FIELD} == $locale`)
  .slice(0)
  .project((sub) => ({
    title: sub.field("name"),
    slug: sub.field("slug.current"),
    seo: sub.field("seo").project(seoFragment),
    default: defaultSeoSettingsQuery,
  }));

export const pagesLanguageSlugQuery = q
  .parameters<{ slug: string; locale: string }>()
  .star.filterByType("translation.metadata")
  .filterRaw("$slug in translations[].value->slug.current")
  .slice(0)
  .project((sub) => ({
    slug: sub
      .field("translations[]")
      .filterBy(`language == $locale`)
      .field("value")
      .deref()
      // Needs raw, since we don't have a strongly typed reference, but all translated pages have a slug field
      .raw("slug.current"),
  }));
