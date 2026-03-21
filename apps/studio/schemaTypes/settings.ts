import { defineType, defineField, ALL_FIELDS_GROUP } from "sanity";

export default defineType({
  name: "settings",
  title: "Ustawienia",
  type: "document",
  description: "top level description",
  groups: [
    {
      name: "seo",
      title: "SEO",
    },
    {
      ...ALL_FIELDS_GROUP,
      hidden: true,
    },
  ],
  fields: [
    defineField({
      name: "seo",
      title: "Domyślne Metadane",
      description: "Metadane domyślne dla wszystkich podstron",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Ustawienia",
      };
    },
  },
});
