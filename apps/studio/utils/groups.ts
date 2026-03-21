import { ALL_FIELDS_GROUP } from "sanity";

/** content, seo (all fields group disabled)*/
export const pageGroups = [
  {
    name: "content",
    title: "Treść",
  },
  {
    name: "seo",
    title: "SEO",
  },
  {
    name: "studio",
    title: "Studio",
  },
  {
    ...ALL_FIELDS_GROUP,
    hidden: true,
  },
];
