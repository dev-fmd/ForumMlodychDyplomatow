import type { DocumentLocation } from "sanity/presentation";

export type RouteDefinition = {
  /**
   * Path segments below the locale root. `:slug` (or any `:param`) is bound
   * as a GROQ parameter, e.g. `["events", ":slug"]` -> `/en/events/:slug`.
   */
  path: readonly string[];
  /** Extra conditions ANDed onto the generated `_type` / language filter. */
  filter?: string;
};

export type ResolvedLocation = Omit<DocumentLocation, "href"> & {
  /** Path segments; `undefined`/`""` entries are dropped. */
  path: readonly (string | undefined | null)[];
  /**
   * Higher sorts first. Use for "this is the document's own page" (high)
   * vs. "it is also referenced here" (low).
   */
  weight?: number;
};

export type LocationContext = {
  /** Resolved language of the document, or the default one. */
  lang: string;
  /** Whether the type is translated. */
  intl: boolean;
};

/** GROQ projection: studio-side key -> GROQ path or subquery. */
export type Selection = Record<string, string>;

/**
 * Declares the shape a projection returns, so `locations` gets real types.
 * Keys must match the `select` keys; values are the expected GROQ result.
 */
export type SelectionShape<S extends Selection> = { [K in keyof S]?: unknown };

export type Selected<T> = { [K in keyof T]?: T[K] | null } | null;

export type DocumentPresentation<
  S extends Selection = Selection,
  T extends SelectionShape<S> = { [K in keyof S]?: string },
> = {
  select?: S;
  routes?: readonly RouteDefinition[];
  locations?: (doc: Selected<T>, ctx: LocationContext) => readonly ResolvedLocation[];
  staticLocations?: readonly ResolvedLocation[];
  weight?: number;
  message?: string;
  tone?: "positive" | "caution" | "critical" | "default";
};

/**
 * `definePresentation<{ shape }>()({ ... })` — curried so you can annotate the
 * projection result while `select` keys stay inferred and checked against it.
 */
export const definePresentation =
  <T extends Record<string, unknown> = Record<string, string>>() =>
  <S extends Selection & Record<keyof T, string>>(
    definition: DocumentPresentation<S, T>
  ): DocumentPresentation<S, T> =>
    definition;
