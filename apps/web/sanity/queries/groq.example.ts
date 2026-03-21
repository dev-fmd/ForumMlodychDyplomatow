import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

// defineQuery enables automatic typing
// if you have Sanity.io extension installed, you will also get syntax highlighting and `execute` button
const postsQuery = defineQuery(`
  *[_type == "post"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    "author": author->name,
    "image": mainImage.asset->url,
    description,
    "categories": categories[]->title,
    body
  }
`);

// Data is typed but not validated (you can use zod or query with groqd instead if you want validation)
const { data } = await sanityFetch({ query: postsQuery });

console.log(data);
