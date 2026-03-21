import { defineField } from "sanity";

export const seoField = defineField({
  name: "seo",
  title: "Metadane",
  type: "seo",
  group: "seo",
});

export const documentNameField = defineField({
  name: "documentName",
  title: "Nazwa dokumentu",
  type: "string",
  group: "studio",
});
