import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  deployment: {
    appId: process.env.SANITY_STUDIO_APP_ID,
    autoUpdates: false,
  },
  typegen: {
    path: ["../web/app/**/*.{ts,tsx}", "../web/sanity/queries/**/*.{ts,tsx}"],
    schema: "./schema.json",
    generates: "../web/sanity/typegen.ts",
  },
});
