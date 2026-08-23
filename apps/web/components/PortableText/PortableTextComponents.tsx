import type { PortableTextComponents } from "@portabletext/react";
import Typography from "../ui/typography";
import Image from "next/image";
import { getBlockText, slugify, urlFor } from "./utils";
import { Link } from "../ui/link";

export const basePortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <Typography as="p" variant="body-l" className="mb-6 text-brand-gray-900">
        {children}
      </Typography>
    ),
    h1: ({ children, value }) => {
      const id = slugify(getBlockText(value));
      return (
        <Typography
          as="h1"
          variant="h3"
          className="my-4 scroll-mt-[20vh] pt-4 text-brand-gray-900"
          asChild
        >
          <h1 id={id}>{children}</h1>
        </Typography>
      );
    },
    h2: ({ children, value }) => {
      const id = slugify(getBlockText(value));
      return (
        <Typography
          as="h2"
          variant="h4"
          className="my-4 scroll-mt-[20vh] pt-4 text-brand-gray-900"
          asChild
        >
          <h2 id={id}>{children}</h2>
        </Typography>
      );
    },
    h3: ({ children }) => (
      <Typography as="h3" variant="h4" className="mt-4 mb-4 text-brand-gray-900">
        {children}
      </Typography>
    ),
    h4: ({ children }) => (
      <Typography as="h4" variant="h4" className="mt-4 mb-3 text-brand-gray-900">
        {children}
      </Typography>
    ),
    h5: ({ children }) => (
      <Typography as="h5" variant="h4" className="mt-4 mb-2 text-brand-gray-900">
        {children}
      </Typography>
    ),
    h6: ({ children }) => (
      <Typography as="h6" variant="h4" className="mt-4 mb-2 text-brand-gray-900">
        {children}
      </Typography>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-r-lg border-l-[3px] border-brand-red px-2 py-0.5 text-brand-red">
        <Typography variant="body-l">{children}</Typography>
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc space-y-2 text-brand-gray-900">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="nested-list mb-6 ml-6 list-decimal space-y-2 text-brand-gray-900">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <Typography as="li" variant="body-l">
        {children}
      </Typography>
    ),
    number: ({ children }) => (
      <Typography as="li" variant="body-l">
        {children}
      </Typography>
    ),
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref && !value?.asset?.url) return null;
      const imageUrl = value.asset.url || urlFor(value.asset).url();

      return (
        <div className="my-10 w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={imageUrl}
              alt={value.alt || "Zdjęcie w treści artykułu"}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <div className="mt-3 flex items-start gap-3 border-l-2 border-brand-red p-1">
              <Typography variant="caption" className="text-muted-brand leading-snug">
                {value.caption}
              </Typography>
            </div>
          )}
        </div>
      );
    },
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-brand-gray-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const target = (value?.href || "").startsWith("http") ? "_blank" : undefined;
      return (
        <Link
          href={value?.href || "#"}
          target={target}
          variant="text"
          className="inline-flex border-none p-0 text-brand-blue-800 no-underline underline-offset-4 transition-colors *:inline hover:border-transparent hover:text-brand-blue-700 hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
};
