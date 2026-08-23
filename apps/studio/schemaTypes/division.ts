import { defineField, defineType } from "sanity";
import { languageField, uniqueByLanguage } from "../plugins/intl";
import { seoField } from "../utils/fields";
import { pageGroups } from "../utils/groups";

export default defineType({
  name: "division",
  title: "Przedstawicielstwo",
  type: "document",
  description: "Podstawowy dokument przedstawicielstwa regionalnego.",
  groups: pageGroups,
  fields: [
    languageField,
    seoField,
    defineField({
      name: "name",
      title: "Nazwa przedstawicielstwa",
      type: "string",
      group: "content",
      description: "Nazwa widoczna na listach, i przy wydarzeniach.",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "sortName",
      title: "Nazwa do sortowania",
      type: "string",
      group: "content",
      description:
        "Nazwa używana do sortowania przedstawicielstw na listach. Jeśli nie zostanie wypełniona, użyta zostanie zwykła nazwa. Sanity nie obsługuje poprawnie sortowania polskich znaków. Polecane znaki to _, aby sortować przed poprzednią literą, lub ~ aby sortować po niej.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description:
        "Przyjazny adres URL, który można wykorzystać przy przyszłej stronie przedstawicielstwa.",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: uniqueByLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Zdjęcie przedstawicielstwa",
      type: "img",
      group: "content",
      description: "Małe zdjęcie prezentujące przedstwicielstwo, używane na listach.",
    }),
    defineField({
      name: "pageBuilder",
      title: "Budowniczy strony",
      type: "pageBuilder",
      group: "content",
    }),
  ],
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
      media: "coverImage",
    },
    prepare({ title, slug, media }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "Brak slugu",
        media: media,
      };
    },
  },
});
