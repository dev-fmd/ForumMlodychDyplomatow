import { defineType, defineField, defineArrayMember } from "sanity";
import { languageField } from "../../plugins/intl";

export default defineType({
  name: "navigation",
  title: "Nawigacja",
  type: "document",
  groups: [
    {
      name: "navigation",
      title: "Nawigacja",
    },
    {
      name: "header",
      title: "Nagłówek",
    },
    {
      name: "footer",
      title: "Stopka",
    },
  ],
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "img",
      group: "header",
      description: "Logo wyświetlane w nagłówku i w faviconie strony.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logoText",
      title: "Tekst logo",
      type: "string",
      group: "header",
      description: "Tekst wyświetlany obok logo w nagłówku.",
    }),
    defineField({
      name: "button",
      title: "Przycisk",
      type: "link",
      group: "header",
    }),
    defineField({
      name: "navigation",
      title: "Nawigacja",
      description: "Linki nawigacyjne",
      type: "array",
      group: "navigation",
      validation: (Rule) => Rule.required().min(1).max(6),
      of: [
        defineArrayMember({
          name: "dropdown",
          title: "Menu rozwijane",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Nazwa",
              type: "string",
              description: "Widoczna jako przycisk/link",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "items",
              title: "Elementy",
              type: "array",
              validation: (Rule) => Rule.required().min(1).max(4),
              of: [
                defineArrayMember({
                  type: "link",
                }),
              ],
            }),
          ],
        }),
        defineArrayMember({
          title: "Link",
          type: "link",
        }),
      ],
    }),

    defineField({
      name: "contactInfo",
      title: "Informacje kontaktowe",
      type: "object",
      group: "footer",
      fields: [
        defineField({
          name: "email",
          title: "Adres e-mail",
          type: "string",
          description: "Adres e-mail wyświetlany w stopce.",
          validation: (Rule) => Rule.email().error("Niepoprawny adres e-mail").required(),
        }),
        defineField({
          name: "phone",
          title: "Numer telefonu",
          type: "string",
          description: "Numer telefonu wyświetlany w stopce. Opcjonalny",
        }),

        defineField({
          name: "socials",
          title: "Media społecznościowe",
          type: "socials",
        }),

        defineField({
          name: "address",
          title: "Adres",
          type: "text",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "identifiers",
          title: "Identyfikator",
          type: "text",
          description: "Pole na numery krs, nip, regon itp.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "additionalLinks",
      title: "Dodatkowe linki",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          name: "footerLink",
          title: "Link stopki",
          type: "link",
        }),
      ],
      description:
        "Dodatkowe linki wyświetlane w stopce, np. Polityka prywatności, Regulamin itp. (maksymalnie 3).",
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
      group: "footer",
      description: "Tekst wyświetlany na samym dole stopki, np. informacja o prawach autorskich.",
    }),
    defineField({
      name: "madeBy",
      title: "Wykonanie",
      type: "string",
      group: "footer",
      description: "Tekst wyświetlany na samym dole stopki",
    }),
    defineField({
      name: "madeByLink",
      title: "Link do wykonawcy",
      type: "link",
      group: "footer",
      description: "Link do wykonawcy wyświetlany na samym dole stopki",
    }),
    languageField,
  ],
  preview: {
    prepare() {
      return {
        title: "Nawigacja",
      };
    },
  },
});
