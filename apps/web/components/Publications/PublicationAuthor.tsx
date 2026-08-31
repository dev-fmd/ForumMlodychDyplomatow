import React from "react";
import { Typography } from "@/components/ui/typography";
import { Tag } from "../ui/tag";
import { getAuthorDisplayData } from "../../app/[locale]/publications/[slug]/helpers";
import { Container } from "../ui/container";
import { getTranslations } from "next-intl/server";
import { Locale } from "next-intl";
import Author from "./Author";
import { GroupAuthorsList } from "./GroupAuthorList";

export interface PublicationAuthorProps {
  authors?: {
    name: string;
    initials: string;
    imageUrl?: string;
    bio?: string;
  }[];
  date?: string;
  isoDate?: string;
  tags?: {
    name: string;
    slug: string;
  }[];
  locale: Locale;
}

export const PublicationAuthor = async ({
  authors,
  date,
  isoDate,
  tags,
  locale,
}: PublicationAuthorProps) => {
  const t = await getTranslations({ locale, namespace: "publications" });

  if (!authors || authors.length === 0) return null;

  const authorData = await getAuthorDisplayData(authors, {
    groupName: t("groupName"),
    groupInitials: t("groupInitials"),
  });

  return (
    <Container contentWidth="xl">
      <div className="mx-auto mb-12 flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          {tags?.map((tag) => (
            <Tag key={tag.slug} href={tag.slug}>
              {tag.name}
            </Tag>
          ))}
        </div>
        <hr className="mb-2 h-px w-full shrink-0 border-none bg-border/60" />
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          {/* Lewa strona: Karta autora (lub awatar grupy) */}
          <Author authors={authors} date={date} isoDate={isoDate} />

          {/* Prawa strona: Bio pojedynczego autora lub rozwijana lista dla grupy */}
          <div className="flex flex-col">
            {authorData.isGroup ? (
              <GroupAuthorsList authors={authors} showAuthorsText={t("showAuthors")} />
            ) : (
              authorData.displayBio && (
                <Typography variant="caption" className="text-black">
                  {authorData.displayBio}
                </Typography>
              )
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
