import { Metadata } from "next";

/**
 * Maps `seo` type defined in Sanity Studio to `Next`'s `Metadata` type.
 * You can use this on every page - properties fetched in subpages will replace parent data;
 * Properites that are not defined are inherited from the parent.
 */
export const mapMetadata = (data?: Record<string, unknown> | null): Metadata => {
  if (!data?.seo || typeof data.seo !== "object" || data.seo === null) return {};

  const m = data.seo as Record<string, any>;

  const metadata: Metadata = {};
  if (m.title) metadata.title = m.title;
  if (m.description) metadata.description = m.description;
  if (m.canonical) metadata.alternates = { canonical: m.canonical };

  metadata.openGraph = {};
  if (m.title) metadata.openGraph.title = m.title;
  if (m.description) metadata.openGraph.description = m.description;
  if (m.ogImage?.asset?.url) metadata.openGraph.images = [{ url: m.ogImage.asset.url }];
  if (m.canonical) metadata.openGraph.url = m.canonical;

  metadata.twitter = {};
  if (m.twitterCreator) metadata.twitter.creator = m.twitterCreator;

  return metadata;
};
