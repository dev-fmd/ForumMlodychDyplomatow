import { defineField, defineType } from "sanity";
import { preview } from "sanity-plugin-icon-picker";

export default defineType({
  name: "category",
  title: "Kategoria",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Ikona",
      type: "iconPicker",
      description:
        "Ikony mogą być wyrenderowane dynamicznie po stronie klienta\nhttps://www.sanity.io/plugins/icon-picker",
      options: {
        providers: ["sa"],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      icon: "icon",
    },
    prepare({ title, icon }) {
      return {
        title,
        subtitle: icon?.provider + " - " + icon?.name,
        media: icon ? preview(icon) : undefined,
      };
    },
  },
});
