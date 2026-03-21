import { q } from "../groqd";

/**
 * This fragment may come in handy if you need to dereference the asset to get url and metadata (lqip, dimensions).
 * Note: `SanityImage` already does this under the hood
 */
export const imgFragment = q.fragmentForType<"img">().project((sub) => ({
  asset: sub
    .field("asset")
    .deref()
    .project((sub) => ({
      _id: sub.field("_id"),
      url: sub.field("url"),
      metadata: sub.field("metadata").project((sub) => ({
        lqip: sub.field("lqip"),
        dimensions: sub.field("dimensions"),
      })),
      // Values added by Sanity media plugin (can be set in asset dashboard):
      altText: sub.field("altText"),
      title: sub.field("title"),
      description: sub.field("description"),
    })),
  crop: sub.field("crop"),
  hotspot: sub.field("hotspot"),
}));
