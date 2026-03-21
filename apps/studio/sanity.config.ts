import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { filterSingletonTemplates, singletonDocumentActions } from "./plugins/singleton";
import { combineTemplates } from "./utils/utils";
import { structure } from "./plugins/structure";
import { addLanguageTemplates, intlConfig } from "./plugins/intl";
import { plPLLocale } from "@sanity/locale-pl-pl";
import { documentInternationalization } from "@sanity/document-internationalization";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media } from "sanity-plugin-media";
import { Logo } from "./components/Logo";
import { envSchema } from "./env";
import { presentationConfig } from "./plugins/presentation";
import { presentationTool } from "sanity/presentation";
import { dashboardTool } from "@sanity/dashboard";
import { vercelWidget } from "sanity-plugin-dashboard-widget-vercel";

const parse = envSchema.safeParse(process.env);
if (!parse.success) {
  console.error(parse.error);
}

/**
 * Sanity Studio Documentation:
 * @see https://www.sanity.io/docs/studio/configuration
 *
 * Structure Tool Plugin (Dashboard customization):
 * @see https://www.sanity.io/docs/studio/structure-tool
 *
 * Presentation Tool Plugin (Live draft editing):
 * @see https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool
 *
 * Vision Plugin (GROQ querying in Studio):
 * @see https://www.sanity.io/docs/content-lake/the-vision-plugin
 *
 * Document Internationalization Plugin:
 * @see https://www.npmjs.com/package/@sanity/document-internationalization
 *
 * Icon Picker Plugin:
 * @see https://www.sanity.io/plugins/icon-picker
 *
 * Media Plugin:
 * @see https://www.npmjs.com/package/sanity-plugin-media
 *
 * Vercel Dashboard Widget:
 * @see https://www.sanity.io/plugins/vercel-dashboard-widget
 */

export default defineConfig({
  name: "default",
  title: "studio",
  icon: Logo,

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,

  plugins: [
    structureTool(structure),
    media(),
    presentationTool(presentationConfig),
    dashboardTool({ widgets: [vercelWidget()] }),
    visionTool(),
    documentInternationalization(intlConfig),
    iconPicker(),
    plPLLocale(),
  ],

  schema: {
    types: schemaTypes,
    templates: combineTemplates(filterSingletonTemplates, addLanguageTemplates),
  },

  document: {
    actions: singletonDocumentActions,
  },
});
