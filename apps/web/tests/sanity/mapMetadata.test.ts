import { describe, expect, it } from "vitest";

import { mapMetadata } from "../../sanity/metadata/mapMetadata";

describe("mapMetadata", () => {
  it("returns empty object when data is missing or seo is invalid", () => {
    expect(mapMetadata()).toEqual({});
    expect(mapMetadata(null)).toEqual({});
    expect(mapMetadata({})).toEqual({});
    expect(mapMetadata({ seo: null })).toEqual({});
    expect(mapMetadata({ seo: "invalid" as unknown as Record<string, unknown> })).toEqual({});
  });

  it("maps all supported seo fields", () => {
    expect(
      mapMetadata({
        seo: {
          title: "Example title",
          description: "Example description",
          canonical: "https://example.com/post",
          twitterCreator: "@example",
          ogImage: {
            asset: {
              url: "https://example.com/og-image.jpg",
            },
          },
        },
      })
    ).toEqual({
      title: "Example title",
      description: "Example description",
      alternates: {
        canonical: "https://example.com/post",
      },
      openGraph: {
        title: "Example title",
        description: "Example description",
        url: "https://example.com/post",
        images: [{ url: "https://example.com/og-image.jpg" }],
      },
      twitter: {
        creator: "@example",
      },
    });
  });

  it("keeps empty openGraph and twitter objects when seo exists but has no mapped fields", () => {
    expect(
      mapMetadata({
        seo: {},
      })
    ).toEqual({
      openGraph: {},
      twitter: {},
    });
  });
});
