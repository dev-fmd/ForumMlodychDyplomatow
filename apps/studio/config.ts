export const LANGUAGE_FIELD = "locale";

type LanguageConfig = {
  id: string;
  title: string;
};

export const LANGUAGES = [
  { id: "pl", title: "PL" },
  { id: "en", title: "EN" },
] as const satisfies readonly LanguageConfig[];

type DocumentConfig = {
  _type: string;
  id?: string;
  intl?: boolean;
  singleton?: boolean;
  path?: string;
  slug?: boolean;
};

// Please run `pnpm run singletons` to generate translation metadata pages when adding singleton types
export const DOCUMENTS = [
  // { _type: "home", id: "home", intl: true, singleton: true, root: true },
  { _type: "settings", id: "settings" },
  { _type: "page", intl: true },
  { _type: "event", intl: true },
  { _type: "division", intl: true },
  { _type: "person" },
  { _type: "navigation", intl: true },
  { _type: "publication", intl: true },
  { _type: "tag", intl: true },
  { _type: "tagCategory", intl: true },
  { _type: "translations", intl: true },
  { _type: "publicationType", intl: true },
] as const satisfies readonly DocumentConfig[];
export type DocumentType = (typeof DOCUMENTS)[number]["_type"];
export type LanguageId = (typeof LANGUAGES)[number]["id"];
