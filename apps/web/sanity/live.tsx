import { client } from "./client";
import { defineLive } from "next-sanity/live";

/**
 * You can configure time based revalidation by setting `revalidate` in `fetchOptions` under `defineLive`
 * This will apply globally to all queries made with `sanityFetch`
 */

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: process.env.SANITY_API_READ_TOKEN,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  fetchOptions: {
    revalidate: Number(process.env.DEFAULT_REVALIDATE),
  },
});
