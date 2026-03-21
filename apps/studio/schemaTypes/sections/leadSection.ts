import { defineField, defineType } from "sanity";

export default defineType({
  name: "leadSection",
  title: "Nagłówek",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Podtytuł",
      type: "text",
    }),
  ],
  preview: {
    prepare() {
      return {
        media: () => "Nagłówek",
      };
    },
  },
});
