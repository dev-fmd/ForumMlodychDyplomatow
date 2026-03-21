import {
  defineDocuments,
  defineLocations,
  PresentationPluginOptions,
  type DocumentLocation,
} from "sanity/presentation";
import { DOCUMENTS, LANGUAGES, LANGAUGE_FIELD } from "../config";

const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:3000";

const mainDocumentRoutes = DOCUMENTS.flatMap((doc) => {
  if (!doc.intl) {
    if (doc.root) {
      return [{ route: "/", filter: `_type == "${doc._type}" && _id == "${doc.id || doc._type}"` }];
    }
    if (doc.slug && doc.path) {
      return [
        { route: `${doc.path}/:slug`, filter: `_type == "${doc._type}" && slug.current == $slug` },
      ];
    }
    if (doc.path) {
      return [
        { route: doc.path, filter: `_type == "${doc._type}" && _id == "${doc.id || doc._type}"` },
      ];
    }
    return [];
  }

  return LANGUAGES.flatMap(({ id: lang }) => {
    if (doc.root) {
      return [
        { route: `/${lang}`, filter: `_type == "${doc._type}" && _id == "${doc._type}-${lang}"` },
      ];
    }
    if (doc.slug && doc.path) {
      return [
        {
          route: `/${lang}${doc.path}/:slug`,
          filter: `_type == "${doc._type}" && slug.current == $slug && ${LANGAUGE_FIELD} == "${lang}"`,
        },
      ];
    }
    if (doc.path) {
      return [
        {
          route: `/${lang}${doc.path}`,
          filter: `_type == "${doc._type}" && _id == "${doc._type}-${lang}"`,
        },
      ];
    }
    return [];
  });
});

const locationResolvers: Record<string, ReturnType<typeof defineLocations>> = Object.fromEntries(
  DOCUMENTS.flatMap((doc): Array<[string, ReturnType<typeof defineLocations>]> => {
    if (!doc.path && !doc.root) return [];

    if (doc.intl) {
      if (doc.slug && doc.path) {
        return [
          [
            doc._type,
            defineLocations({
              select: { title: "title", slug: "slug.current", lang: LANGAUGE_FIELD },
              resolve: (d) => {
                const lang = d?.lang ?? LANGUAGES[0].id;
                const href = d?.slug ? `/${lang}${doc.path}/${d.slug}` : undefined;
                return {
                  locations: href
                    ? [{ title: d?.title || "Untitled", href } satisfies DocumentLocation]
                    : [],
                };
              },
            }),
          ],
        ];
      }

      if (doc.root) {
        return [
          [
            doc._type,
            defineLocations({
              select: { lang: LANGAUGE_FIELD },
              resolve: (d) => {
                const lang = d?.lang ?? LANGUAGES[0].id;
                return {
                  locations: [
                    {
                      title: `Home (${lang.toUpperCase()})`,
                      href: `/${lang}`,
                    } satisfies DocumentLocation,
                  ],
                };
              },
            }),
          ],
        ];
      }

      // Translated singleton with path (non-root)
      return [
        [
          doc._type,
          defineLocations({
            select: { title: "title", lang: LANGAUGE_FIELD },
            resolve: (d) => {
              const lang = d?.lang ?? LANGUAGES[0].id;
              return {
                locations: [
                  {
                    title: d?.title || doc._type,
                    href: `/${lang}${doc.path}`,
                  } satisfies DocumentLocation,
                ],
              };
            },
          }),
        ],
      ];
    }

    // Non-translated singleton with path
    if (doc.singleton || (!doc.slug && doc.path)) {
      return [
        [
          doc._type,
          defineLocations({
            locations: [
              { title: doc._type, href: doc.root ? "/" : doc.path! } satisfies DocumentLocation,
            ],
            message: "This document is used globally",
            tone: "positive" as const,
          }),
        ],
      ];
    }

    // Non-translated slug document
    if (doc.slug && doc.path) {
      return [
        [
          doc._type,
          defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (d) => ({
              locations: d?.slug
                ? [
                    {
                      title: d?.title || "Untitled",
                      href: `${doc.path}/${d.slug}`,
                    } satisfies DocumentLocation,
                  ]
                : [],
            }),
          }),
        ],
      ];
    }

    return [];
  })
);

export const presentationConfig: PresentationPluginOptions = {
  previewUrl: {
    origin: SANITY_STUDIO_PREVIEW_URL,
    previewMode: {
      enable: "/api/draft-mode/enable",
    },
  },
  resolve: {
    mainDocuments: defineDocuments(mainDocumentRoutes),
    locations: locationResolvers,
  },
};
