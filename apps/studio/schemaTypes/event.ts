import { defineField, defineType } from "sanity";
import { languageField } from "../plugins/intl";
import { pageGroups } from "../utils/groups";
import { seoField } from "../utils/fields";

const formatEventDate = (date?: string) => {
  if (!date) return "Bez daty";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export default defineType({
  name: "event",
  title: "Wydarzenie",
  type: "document",
  description:
    "Wydarzenia wykorzystywane do prezentacji nadchodzących i archiwalnych aktywności organizacji.",
  groups: pageGroups,
  fields: [
    languageField,
    seoField,
    defineField({
      name: "name",
      title: "Nazwa wydarzenia",
      type: "string",
      group: "content",
      description: "Pełna nazwa widoczna na liście wydarzeń i stronie szczegółowej.",
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "Przyjazny adres URL wydarzenia.",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Data rozpoczęcia",
      type: "datetime",
      group: "content",
      description:
        "Termin rozpoczęcia wydarzenia. Na jego podstawie można rozdzielać wydarzenia przyszłe i archiwalne.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Data zakończenia",
      type: "datetime",
      group: "content",
      description: "Opcjonalna data zakończenia wydarzenia, jeśli trwa dłużej niż jeden termin.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const startDate = context.document?.startDate as string | undefined;

          if (!value || !startDate) {
            return true;
          }

          return new Date(value) >= new Date(startDate)
            ? true
            : "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.";
        }),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      group: "content",
      description: "Powiązanie wydarzenia z lokalną reprezentacją organizacji.",
      to: {
        type: "region",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Miejsce",
      type: "string",
      group: "content",
      description:
        "Nazwa obiektu, instytucji lub platformy online, na której odbywa się wydarzenie.",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "text",
      rows: 3,
      group: "content",
      description: "Adres wydarzenia lub informacja organizacyjna dla wydarzeń online.",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "excerpt",
      title: "Krótki opis",
      type: "text",
      rows: 3,
      group: "content",
      description: "Zwięzły opis do listingów, kart i zajawki SEO.",
      validation: (Rule) => Rule.required().max(220),
    }),
    defineField({
      name: "description",
      title: "Opis wydarzenia",
      type: "richText",
      group: "content",
      description: "Pełny opis wydarzenia widoczny na stronie szczegółowej.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Grafika główna",
      type: "img",
      group: "content",
      description: "Obraz reprezentujący wydarzenie w listach i na stronie szczegółowej.",
    }),
    defineField({
      name: "registrationUrl",
      title: "Link do rejestracji",
      type: "url",
      group: "content",
      description: "Opcjonalny link do formularza zapisów lub strony z dodatkowymi informacjami.",
      validation: (Rule) => Rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "name",
      startDate: "startDate",
      endDate: "endDate",
      region: "region.name",
      media: "image",
    },
    prepare({ title, startDate, endDate, region, media }) {
      const start = formatEventDate(startDate);
      const end = endDate ? formatEventDate(endDate) : undefined;
      const dateLabel = end ? `${start} – ${end}` : start;

      return {
        title,
        subtitle: region ? `${dateLabel} • ${region}` : dateLabel,
        media,
      };
    },
  },
});
