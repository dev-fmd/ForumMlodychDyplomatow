import { PluginConfig } from "@sanity/document-internationalization";
import { PluginConfig as ArrayPluginConfig } from "sanity-plugin-internationalized-array";
import { StructureBuilder } from "sanity/structure";
import { SlugValidationContext } from "sanity";
import { capitalize } from "../utils/utils";
import { defineField } from "sanity";

import { DOCUMENTS, LANGUAGE_FIELD, LANGUAGES } from "../config";
const TRANSLATIONS = DOCUMENTS.filter((d) => "intl" in d && d.intl).map((d) => d._type);
const API_VERSION = process.env.SANITY_STUDIO_API_VERSION;

/** Config for `@sanity/document-internationalization` plugin */
export const intlConfig: PluginConfig = {
  supportedLanguages: LANGUAGES as any,
  schemaTypes: TRANSLATIONS,
  languageField: LANGUAGE_FIELD,
};
export const intlArrayConfig: ArrayPluginConfig = {
  languages: LANGUAGES as any,
  defaultLanguages: LANGUAGES.map((l) => l.id),
  fieldTypes: ["string", "text"],
};

/** Structure API helper to create a list item for documents only in the specified language */
export const SingleLanguageList = (
  S: StructureBuilder,
  options: { type: string; title?: string; lang?: string; icon?: any }
) => {
  const { type, title, icon, lang = LANGUAGES[0].id } = options;
  return S.listItem()
    .title(title || capitalize(type))
    .icon(icon)
    .child(
      S.documentTypeList(type)
        .title(title || capitalize(type))
        .apiVersion(API_VERSION)
        .filter(`_type == $type && ${LANGUAGE_FIELD} == $lang`)
        .params({ type, lang })
        .initialValueTemplates([S.initialValueTemplateItem(`${type}_${lang}`).parameters({ lang })])
    );
};

/** Structure API helper to create a list item with separate tabs for documents in each language */
export const LanguageChoiceList = (
  S: StructureBuilder,
  options: { type: string; title?: string; plural?: string; icon?: any }
) => {
  const { type, title, plural, icon } = options;
  return S.listItem()
    .title(title || capitalize(type))
    .icon(icon)
    .child(
      S.list()
        .title(`${title || capitalize(type)} by Language`)
        .items([
          S.listItem()
            .title(`All ${plural || ""}`)
            .child(
              S.documentTypeList(type)
                .title(`All ${plural || ""}`)
                .apiVersion(API_VERSION)
                .filter(`_type == "${type}"`)
            ),
          ...LANGUAGES.map(({ id, title }) =>
            SingleLanguageList(S, { type, title: `${title} ${options.plural || ""}`, lang: id })
          ),
        ])
    );
};

/** Structure API helper to create a singleton list item with translation support */
export const SingleLanguageSingleton = (
  S: StructureBuilder,
  options: { type: string; id?: string; title?: string; icon?: any; lang?: string }
) => {
  const { type, id = type, title, icon, lang = LANGUAGES[0].id } = options;
  return S.listItem()
    .title(title || capitalize(type))
    .id(`${id}-${lang}`)
    .child(S.document().schemaType(type).documentId(`${type}-${lang}`))
    .icon(icon);
};

/** Structure API helper to create a list item for translation metadata documents */
export const TranslationMetadata = (
  S: StructureBuilder,
  options?: { title?: string; icon?: any }
) => {
  const { title, icon } = options || {};
  return S.listItem()
    .title(title || "Translations")
    .icon(icon)
    .child(S.documentTypeList("translation.metadata"));
};

/** A function that adds appropriate templates for each language filtered list */
export const addLanguageTemplates = (templates: any[]) => {
  return [
    ...templates.filter(({ schemaType }) => !TRANSLATIONS.includes(schemaType)),
    ...LANGUAGES.flatMap(({ id: lang, title }) =>
      TRANSLATIONS.map((type) => ({
        id: `${type}_${lang}`,
        title: `${title} ${capitalize(type)}`,
        schemaType: type,
        value: { [LANGUAGE_FIELD]: lang },
      }))
    ),
  ];
};

/** A field that stores language id, required by the internationalization plugin */
export const languageField = defineField({
  name: LANGUAGE_FIELD,
  type: "string",
  hidden: true,
});
const uniqueBase =
  (
    filters: string,
    parameters: (value: string, context: SlugValidationContext) => Record<string, any>,
    validate?: (context: SlugValidationContext) => string | undefined
  ) =>
  async (slug: string, context: SlugValidationContext) => {
    const { document, getClient } = context;
    if (!document) {
      console.warn(`Couldn't validate slug: ${slug} document not found`);
      return false;
    }

    if (validate) {
      const validateRes = validate(context);
      if (validateRes) {
        console.warn(`Couldn't validate slug: ${validateRes}`);
        return false;
      }
    }

    const client = getClient({ apiVersion: API_VERSION });
    const id = document._id.replace(/^drafts\./, ""); // also check drafts

    const params = {
      type: document._type,
      ...parameters(slug, context),
      draftId: `drafts.${id}`,
      publishedId: id,
    };
    const query = `
    count(*[
      _type == $type &&
      ${filters} ${filters ? "&&" : ""}
      !(_id in [$draftId, $publishedId])
    ])
  `;
    const count = await client.fetch(query, params);
    return count === 0;
  };
export const unique = uniqueBase(`slug.current == $slug`, (value, ctx) => ({
  slug: value,
}));
/** Slug validator that allows same unique slug for different translations of the same document */
export const uniqueByLanguage = uniqueBase(
  `slug.current == $slug && ${LANGUAGE_FIELD} == $language`,
  (value, ctx) => ({
    slug: value,
    language: ctx.document?.[LANGUAGE_FIELD],
  }),
  (ctx) => {
    if (!ctx.document?.[LANGUAGE_FIELD]) {
      return "Locale not found";
    }
  }
);
