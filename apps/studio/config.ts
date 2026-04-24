export const LANGAUGE_FIELD = "locale";

type LanguageConfig = {
  id: string;
  title: string;
};

export const LANGUAGES: LanguageConfig[] = [
  { id: "pl", title: "PL" },
  { id: "en", title: "EN" },
];

type DocumentConfig = {
  _type: string;
  id?: string;
  intl?: boolean;
  singleton?: boolean;
  root?: boolean;
  path?: string;
  slug?: boolean;
};

// Please run `pnpm run singletons` to generate translation metadata pages when adding singleton types
export const DOCUMENTS: DocumentConfig[] = [
  { _type: "home", id: "home", intl: true, singleton: true, root: true },
  { _type: "settings", id: "settings" },
  { _type: "post", intl: true, path: "/post", slug: true },
  { _type: "event", intl: true },
  { _type: "region", intl: true },
  { _type: "author", intl: true },
];
