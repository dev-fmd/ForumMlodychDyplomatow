import { SanityRichText } from "@/sanity/richText/SanityRichText";
import { SanityImage } from "@/sanity/image/SanityImage";
import { q } from "@/sanity/groqd";
import { sanityFetch } from "@/sanity/live";
import { mapMetadata } from "@/sanity/metadata/mapMetadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// QROQD Query builders
const postSlugs = q.star
  .filterByType("post")
  .project((sub) => ({ slug: sub.field("slug.current") }));

const post = q
  .parameters<{ slug: string }>()
  .star.filterByType("post")
  .filterBy("slug.current == $slug")
  .slice(0);

/** Next doesn't know what slugs exist -> we can inform it so it can pre-generate all posts
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postSlugs.query,
    perspective: "published",
    stega: false,
  });
  return postSlugs.parse(data); // [{ slug: example-slug }, ...]
}

/** This allows us to overwrite specific metadata fields from the parent (e.g. title, description)
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // since slug is unique per language we don't need locale here
  const { data } = await sanityFetch({
    query: post.query,
    params: { slug },
    perspective: "published",
    stega: false,
  });
  return mapMetadata(post.parse(data));
}

/** This page renders posts dynamically based on the slug in the URL path */
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  setRequestLocale(locale); // Enables static rendering

  const { data } = await sanityFetch({ query: post.query, params: { slug } });
  if (!data) notFound();
  const p = post.parse(data)!;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="flex flex-col gap-6 border border-dotted p-5">
            <div key={p._id} className="flex flex-col gap-2 relative">
              <SanityImage image={p.image} mode="cover" width={600} height={300} />
              <SanityRichText value={p.body} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
