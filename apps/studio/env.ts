import { z } from "zod";

const vDateRegex = /^v\d{4}-\d{2}-\d{2}$/;
const vDateError = { message: "Must be in format vYYYY-MM-DD" };

export const envSchema = z.object({
  SANITY_STUDIO_PROJECT_ID: z.string().min(1),
  SANITY_STUDIO_ORGANIZATION_ID: z.string().min(1),
  SANITY_STUDIO_DATASET: z.string(),
  SANITY_STUDIO_API_VERSION: z.string().regex(vDateRegex, vDateError),
  SANITY_STUDIO_APP_ID: z.string().optional(),
  CI: z.enum(["true", "false"]).optional(),
  SANITY_STUDIO_PREVIEW_URL: z.url().optional(),
});

// augment process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
