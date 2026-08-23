import { type DocumentType } from "../../config";
import {
  definePresentation,
  type DocumentPresentation,
  type LocationContext,
  type ResolvedLocation,
} from "./types";

/** Slug-based page under `base`, treating `home` as the section index. */
const slugRoute = (base: string | undefined, title: string, weight: number) =>
  definePresentation()({
    select: { title: "title", name: "name", slug: "slug.current" },
    routes: [
      { path: [base, ":slug"].filter(Boolean) as string[], filter: "slug.current == $slug" },
    ],
    weight,
    locations: (doc, { lang }) => {
      const slug = doc?.slug?.replace(/^\//, "");
      if (!slug) return [];

      return [
        {
          title: doc?.title || doc?.name || title,
          path: slug === "home" ? [lang, base] : [lang, base, slug],
        },
      ];
    },
  });

/** Documents whose locations come from a reverse-reference query. */
export type QueryPresentation<T> = {
  /** GROQ body projected onto the current document (`$ids` is provided). */
  query: string;
  resolve: (result: T | null, ctx: LocationContext) => readonly ResolvedLocation[];
  weight?: number;
  message?: string;
};

export const PRESENTATION = {
  page: slugRoute(undefined, "Page", 100),
  division: slugRoute("divisions", "Division", 80),
  publication: slugRoute("publications", "Publication", 60),
} satisfies Partial<Record<DocumentType, DocumentPresentation<any>>>;
