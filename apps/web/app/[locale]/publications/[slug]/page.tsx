import { notFound } from "next/navigation";
import {
  singlePublicationQuery,
  relatedPublicationsQuery,
  publicationsStaticParams,
  publicationMetadataQuery,
} from "@/sanity/queries/publications";
import { runQuery } from "../../../../sanity/groqd";
import { PublicationHero } from "@/components/Publications/PublicationHero";
import { PublicationBody } from "@/components/Publications/PublicationBody";
import { RelatedPublications } from "@/components/Publications/RelatedPublications";
import { PublicationPdf } from "@/components/Publications/PublicationPdf";
import { PublicationAuthor } from "@/components/Publications/PublicationAuthor";
import type { Locale } from "next-intl";
import { getInitials } from "./helpers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { formatLink } from "../../../../lib/links";
import type { BreadcrumbsFragment } from "../../../../sanity/queries/breadcrumbs";
import type { Metadata } from "next";
import { createJsonLdArticle, createSeo } from "../../../../lib/seo";

type Params = {
  locale: Locale;
  slug: string;
};

export const revalidate = 3600; // 1 hour

export const generateStaticParams = async () => {
  const { data } = await runQuery(publicationsStaticParams, {
    stega: false,
    perspective: "published",
  });
  return data;
};

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const parameters = await props.params;

  const { data: page } = await runQuery(publicationMetadataQuery, {
    parameters,
    stega: false,
    perspective: "published",
  });

  return createSeo({
    ...page,
    slug: `publications/${parameters.slug}`,
  });
}

export default async function PublicationDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "publications.singlePublicationPage" });
  setRequestLocale(locale ?? "pl");
  const { data: publication } = await runQuery(singlePublicationQuery, {
    parameters: { locale, slug },
  });
  const { data: seo } = await runQuery(publicationMetadataQuery, {
    parameters: { locale, slug },
    stega: false,
  });

  if (!publication) {
    notFound();
  }

  const currentTagIds = publication.tags?.map((tag: any) => tag._id).filter(Boolean) || [];

  const { data: rawRelatedPublications } = await runQuery(relatedPublicationsQuery, {
    parameters: {
      locale,
      currentId: publication._id,
      tagIds: currentTagIds,
      pubType: publication.type?.title || null,
      limit: 3,
    },
  });

  // Formatowanie daty głównego artykułu
  const formattedDate = publication.date
    ? new Date(publication.date).toLocaleDateString(locale, {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    : undefined;

  const isoDate = publication.date ?? undefined;

  const tags =
    publication.tags
      ?.map((tag) => ({
        name: tag?.name,
        slug: tag?.slug?.current,
      }))
      .filter((tag): tag is { name: string; slug: string } => Boolean(tag?.name && tag?.slug)) ||
    [];

  const authorsData = publication.authors
    ?.filter((author) => Boolean(author?.name))
    .map((author) => ({
      name: author.name || "",
      initials: getInitials(author.name || ""),
      imageUrl: author.img?.asset?.url ?? undefined,
      bio: author.bio ?? "",
    }));

  const breadcrumbs = [
    formatLink({ slug: `/`, type: "page", text: t("breadcrumbHome") }),
    formatLink({
      text: t("breadcrumbsPublication"),
      type: "publication",
      slug: `/publications`,
    }),
  ].map(
    (i, index) =>
      ({
        _key: `breadcrumb-${index}`,
        _type: "breadcrumb",
        link: i,
      }) as BreadcrumbsFragment
  );
  const jsonLd = createJsonLdArticle(seo);

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicationHero
        breadcrumbs={breadcrumbs}
        category={publication.type?.title ?? ""}
        title={publication.title ?? ""}
        excerpt={publication.excerpt ?? undefined}
        tags={tags}
        authors={authorsData}
        date={formattedDate}
        isoDate={isoDate}
        pdfUrl={publication.pdfFile?.url}
        image={publication.mainImage}
        locale={locale}
      />

      <PublicationBody content={publication.text || []} locale={locale} />

      <PublicationPdf pdfUrl={publication.pdfFile?.url} />

      <PublicationAuthor
        authors={authorsData}
        date={formattedDate}
        isoDate={isoDate}
        tags={tags}
        locale={locale}
      />

      <RelatedPublications publications={rawRelatedPublications} locale={locale} />
    </div>
  );
}
