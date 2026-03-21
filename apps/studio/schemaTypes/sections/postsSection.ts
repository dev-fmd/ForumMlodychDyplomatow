import { defineField, defineType } from "sanity";

export default defineType({
  name: "postsSection",
  title: "Posty",
  type: "object",
  fields: [
    defineField({
      name: "displayNumber",
      title: "Liczba postów",
      type: "number",
    }),
  ],
  preview: {
    select: {
      displayNumber: "displayNumber",
    },
    prepare(selection) {
      return {
        media: () => `Posty (${selection.displayNumber})`,
      };
    },
  },
});
