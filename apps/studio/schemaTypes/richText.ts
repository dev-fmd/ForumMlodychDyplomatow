import { defineArrayMember, defineType } from "sanity";

export default defineType({
  name: "richText",
  title: "Akapit",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        {
          title: "Tekst",
          value: "normal",
        },
        {
          title: "H1",
          value: "h1",
        },
        {
          title: "H2",
          value: "h2",
        },
        {
          title: "H3",
          value: "h3",
        },
        {
          title: "H4",
          value: "h4",
        },
        {
          title: "Cytat",
          value: "blockquote",
        },
      ],
      lists: [
        {
          title: "Lista",
          value: "bullet",
        },
      ],
      marks: {
        decorators: [
          {
            title: "Pogrubienie",
            value: "strong",
          },
          {
            title: "Kursywa",
            value: "em",
          },
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
    }),
  ],
});
