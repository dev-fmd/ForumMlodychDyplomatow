import type { InferFragmentType } from "groqd";
import type { Locale } from "next-intl";
import type { publicationPreviewFragment } from "../../../../sanity/queries/publications";
import { getGlobalLogo } from "@/lib/getGlobalLogo";

type PublicationPreviewType = InferFragmentType<typeof publicationPreviewFragment>;
type AuthorImgType = NonNullable<PublicationPreviewType["authors"]>[number]["img"];

export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export type AuthorInput = {
  name?: string | null;
  initials?: string | null;
  imageUrl?: string | null;
  img?: AuthorImgType | null;
  bio?: string | null;
};

export const getAuthorDisplayData = async (
  authors: AuthorInput[] | null | undefined,
  translations: { groupName: string; groupInitials: string }
) => {
  const isGroup = authors && authors.length > 1;
  const firstAuthor = authors?.[0];

  const defaultLogo = isGroup ? await getGlobalLogo() : null;

  return {
    isGroup,
    displayName: isGroup ? translations.groupName : (firstAuthor?.name ?? ""),
    displayBio: isGroup ? "" : (firstAuthor?.bio ?? ""),
    displayImageUrl: isGroup ? defaultLogo : (firstAuthor?.imageUrl ?? undefined),
    displaySanityImage: isGroup ? null : (firstAuthor?.img ?? null),
    displayInitials: isGroup
      ? translations.groupInitials
      : (firstAuthor?.initials ?? getInitials(firstAuthor?.name ?? "")),
  };
};

export const formatPublicationForCard = (
  pub: InferFragmentType<typeof publicationPreviewFragment>,
  locale: Locale,
  t: any
) => ({
  title: pub.title || t.noTitle,
  excerpt: pub.excerpt ?? undefined,
  href: `/${locale}/publications/${pub.slug}`,
  date: pub.date
    ? new Date(pub.date).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined,
  isoDate: pub.date,
  tags: pub.tags?.map((tag: any) => tag.name).filter(Boolean) || [],
  authors:
    pub.authors?.map((a: any) => ({
      name: a.name,
      initials: getInitials(a.name ?? ""),
      img: a.img,
    })) || [],
  image: pub.mainImage?.asset?.url
    ? {
        src: pub.mainImage.asset.url,
        alt: pub.mainImage.asset.altText || pub.title || "Zdjęcie powiązanej publikacji",
        blurDataURL: pub.mainImage.asset.metadata?.lqip ?? undefined,
      }
    : null,
});
