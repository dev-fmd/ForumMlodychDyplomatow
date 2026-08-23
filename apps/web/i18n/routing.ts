import { defineRouting } from "next-intl/routing";
import { locales } from "@/i18n/locales";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: locales,
  localePrefix: "as-needed",

  // Used when no locale matches
  defaultLocale: "pl",
});
