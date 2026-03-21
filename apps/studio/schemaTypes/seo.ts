import { defineType, defineField } from "sanity";
import { CharCountInput, CharCountTextOptions } from "../components/CharCountInput";

export default defineType({
  name: "seo",
  title: "Metadane",
  type: "object",
  description: "Wypełnione pola zastępują domyślne metadane z zakładki Ustawienia.",
  fields: [
    defineField({
      name: "title",
      title: "Tytuł strony",
      type: "string",
      description: "Do 60 znaków",
      options: { rows: 1, max: 60 } as CharCountTextOptions,
      components: { input: CharCountInput },
      validation: (Rule) =>
        Rule.max(60).warning("Długie tytuły mogą być ucięte w wynikach wyszukiwania"),
    }),
    defineField({
      name: "description",
      title: "Opis strony",
      type: "text",
      description: "Około 150-160 znaków",
      options: { rows: 3, max: 160 } as CharCountTextOptions,
      components: { input: CharCountInput },
      validation: (Rule) =>
        Rule.max(160).warning("Długie opisy mogą być ucięte w wynikach wyszukiwania"),
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      description: "Preferowany adres URL strony",
    }),
    defineField({
      name: "ogImage",
      title: "Obraz Open Graph",
      description: "Obraz wyświetlany w wynikach wyszukiwania i social mediach",
      type: "img",
      options: { hotspot: true },
    }),
    defineField({
      name: "twitterCreator",
      title: "Twitter @Creator",
      type: "string",
      description: "Opcjonalna @nazwa_użytkownika autora",
    }),
    defineField({
      name: "robots",
      title: "Instrukcje dla robotów",
      type: "object",
      fields: [
        defineField({
          name: "noIndex",
          title: "No Index",
          type: "boolean",
          description: "Zabrania wyszukiwarkom indeksowania strony",
        }),
        defineField({
          name: "noFollow",
          title: "No Follow",
          type: "boolean",
          description: "Zabrania wyszukiwarkom podążania za linkami na stronie",
        }),
      ],
    }),
  ],
});
