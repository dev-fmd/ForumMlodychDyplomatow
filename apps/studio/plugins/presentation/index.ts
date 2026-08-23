import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";
import { DOCUMENTS, LANGUAGES, LANGUAGE_FIELD, type DocumentType } from "../../config";
import { PRESENTATION } from "./registry";
import type { ResolvedLocation } from "./types";

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";
const DEFAULT_LANGUAGE = LANGUAGES[0].id;
const LANG_KEY = "__lang";

/** Joins segments into a normalised absolute path, dropping empty ones. */
const joinPath = (...segments: readonly (string | undefined | null)[]) =>
  `/${segments.filter(Boolean).join("/")}`.replace(/\/{2,}/g, "/");

const isTranslated = (type: string) =>
  DOCUMENTS.some((doc) => doc._type === type && "intl" in doc && doc.intl);

/** `[undefined]` keeps non-translated types on a single, locale-less pass. */
const languagesFor = (type: string): readonly (string | undefined)[] =>
  isTranslated(type) ? LANGUAGES.map(({ id }) => id) : [undefined];

const entries = Object.entries(PRESENTATION) as [
  DocumentType,
  (typeof PRESENTATION)[keyof typeof PRESENTATION],
][];

/** More static segments first, so `/events/archive` beats `/events/:slug`. */
const specificity = (path: readonly string[]) => [
  path.filter((segment) => !segment.startsWith(":")).length,
  path.length,
];

const mainDocumentRoutes = entries
  .flatMap(([type, def]) =>
    (def.routes ?? []).flatMap((route) =>
      languagesFor(type).map((lang) => ({
        path: route.path,
        route: joinPath(lang, ...route.path),
        filter: [`_type == "${type}"`, lang && `${LANGUAGE_FIELD} == "${lang}"`, route.filter]
          .filter(Boolean)
          .join(" && "),
      }))
    )
  )
  .sort((a, b) => {
    const [aStatic, aTotal] = specificity(a.path);
    const [bStatic, bTotal] = specificity(b.path);
    return bStatic - aStatic || bTotal - aTotal;
  })
  .map(({ path: _path, ...route }) => route);

const toLocations = (resolved: readonly ResolvedLocation[], base = 0) =>
  [...resolved]
    .map(({ path, weight = 0, ...location }) => ({
      ...location,
      href: joinPath(...path),
      weight: weight + base,
    }))
    .sort((a, b) => b.weight - a.weight)
    .map(({ weight: _weight, ...location }) => location);

const locations = Object.fromEntries(
  entries.map(([type, def]) => {
    const { locations: resolveLocations, staticLocations, message, weight = 0 } = def;
    const intl = isTranslated(type);

    if (!resolveLocations) {
      return [
        type,
        defineLocations({
          locations: toLocations(staticLocations ?? []),
          message,
        }),
      ];
    }

    return [
      type,
      defineLocations({
        select: { ...((def.select as any) ?? {}), ...(intl ? { [LANG_KEY]: LANGUAGE_FIELD } : {}) },
        resolve: (doc) => {
          const lang = (intl && doc?.[LANG_KEY]) || DEFAULT_LANGUAGE;

          return {
            locations: toLocations(
              [...resolveLocations(doc as never, { lang, intl }), ...(staticLocations ?? [])],
              weight
            ),
            message,
          };
        },
      }),
    ];
  })
);

export const presentationConfig: PresentationPluginOptions = {
  previewUrl: {
    origin: PREVIEW_URL,
    previewMode: { enable: "/api/draft-mode/enable" },
  },
  resolve: {
    mainDocuments: defineDocuments(mainDocumentRoutes),
    locations,
  },
};
