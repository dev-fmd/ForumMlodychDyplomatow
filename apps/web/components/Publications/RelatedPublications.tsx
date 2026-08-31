import { Typography } from "@/components/ui/typography";
import type { InferFragmentType } from "groqd";
import type { publicationPreviewFragment } from "../../sanity/queries/publications";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/components/ui/link";
import { ChevronRight } from "lucide-react";
import { PublicationCard } from "@/components/ui/publication-card";
import { Container } from "@/components/ui/container";

export interface RelatedPublicationsProps {
  publications: InferFragmentType<typeof publicationPreviewFragment>[];
  locale?: Locale;
}

export const RelatedPublications = async ({
  publications,
  locale = "pl",
}: RelatedPublicationsProps) => {
  if (!publications || publications.length === 0) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "publications" });

  return (
    <Container
      background="slate"
      size="none"
      className="px-6 pt-10 pb-16 md:px-6"
      contentWidth="max"
    >
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <Typography as="h2" variant="h2" className="text-black">
          {t("singlePublicationPage.relatedPublicationTitle")}
        </Typography>

        <Link href="/publications" variant="secondary" size="l" className="text-brand-red">
          {t("singlePublicationPage.allPublications")} <ChevronRight />
        </Link>
      </div>

      <div className="mx-auto grid max-w-(--width-content-xl) grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {publications.slice(0, 4).map((pub) => (
          <PublicationCard key={pub._id} publication={pub} layout="vertical" className="h-full" />
        ))}
      </div>
    </Container>
  );
};
