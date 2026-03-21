import { defineField, defineType } from "sanity";
import { languageField } from "../../plugins/intl";
import { pageGroups } from "../../utils/groups";
import { seoField } from "../../utils/fields";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: pageGroups,
  fields: [
    languageField,
    seoField,
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "author",
      title: "Autor",
      type: "reference",
      group: "content",
      validation: (Rule) => Rule.required(),
      to: {
        type: "author",
      },
    }),
    defineField({
      name: "image",
      title: "Główny obraz",
      type: "img",
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Kategorie",
      type: "array",
      group: "content",
      validation: (Rule) => Rule.required().min(1).max(3),
      of: [
        {
          type: "reference",
          to: {
            type: "category",
          },
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Opublikowano",
      type: "datetime",
      group: "content",
      initialValue: new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Treść",
      type: "richText",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image",
    },
    prepare(selection) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author && `by ${author}`,
      };
    },
  },
});
