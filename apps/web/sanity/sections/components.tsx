import type { Img, LeadSection, PostsSection } from "@/sanity/typegen";
import { Link } from "@/i18n/navigation";
import { SanityImage } from "@/sanity/image/SanityImage";
import { ComponentType } from "react";
import { q } from "../groqd";
import { sanityFetch } from "../live";
import { getLocale } from "next-intl/server";

/**
 * Example: A `section` registry mapping Sanity `_type` values to React components.
 *
 * Notes:
 * - TypeScript support -> you can infer query return types from GROQD or use typegen output
 * - Components can be inlined (as shown) or imported from separate files for better organization
 * - Remember that async components are server components (won't work on the client)
 * - Missing or null fields should be handled within each component
 */
export const components: { [key: string]: ComponentType<any> } = {
  sectionLead: ({ item }: { item: LeadSection }) => (
    <>
      <h1 className="max-w-xs heading-1">{item.title}</h1>
      <p className="max-w-md body-base">{item.subtitle}</p>
    </>
  ),
  sectionPost: async ({ item }: { item: PostsSection }) => {
    const locale = await getLocale();
    const latestPosts = q
      .parameters<{ locale: string }>()
      .star.filterByType("post")
      .filterBy("locale == $locale")
      .slice(0, item.displayNumber ?? 3)
      .order("publishedAt desc")
      .project((sub) => ({
        _id: sub.field("_id"),
        title: sub.field("title"),
        image: sub.field("image"),
        slug: sub.field("slug"),
      }));
    const { data } = await sanityFetch({ query: latestPosts.query, params: { locale } });
    const posts = latestPosts.parse(data);
    if (!posts) return <h2>No posts found.</h2>;
    return (
      <>
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug?.current}`}>
            <h2>{post.title}</h2>
            <SanityImage image={post.image} height={300} width={300} />
          </Link>
        ))}
      </>
    );
  },
  sectionImage: ({ item }: { item: Img }) => <SanityImage image={item} height={300} width={300} />,
};
