import { defineField, defineType } from "sanity";
import { languageField } from "../plugins/intl";
import { pageGroups } from "../utils/groups";
import { seoField } from "../utils/fields";

export default defineType({
  name: "region",
  title: "Region",
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
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description:
        "Przyjazny adres URL, który można wykorzystać przy przyszłej stronie przedstawicielstwa.",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "Brak slugu",
      };
    },
  },
});
