import { defineField, defineType } from "sanity";
import { languageField } from "../plugins/intl";

export default defineType({
  name: "author",
  title: "Autor",
  type: "document",
  fields: [
    languageField,
    defineField({
      name: "name",
      title: "Imię",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "img",
      title: "Obraz",
      type: "img",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      validation: (Rule) => Rule.required(),
      of: [
        {
          title: "Block",
          type: "block",
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                title: "URL",
                name: "link",
                type: "object",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
          styles: [
            {
              title: "Normal",
              value: "normal",
            },
          ],
          lists: [],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "img",
    },
  },
});
