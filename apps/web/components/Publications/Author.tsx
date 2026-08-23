"use client";
import { useTranslations, type Locale } from "next-intl";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Typography from "../ui/typography";
import { getAuthorDataAction } from "@/lib/getAuthorServer";
import { AuthorInput } from "@/app/[locale]/publications/[slug]/helpers";

const getInitialsSync = (name?: string | null) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

const Author = ({
  authors,
  date,
  isoDate,
  locale,
}: {
  authors: AuthorInput[] | null;
  date?: string | null;
  isoDate?: string | null;
  locale: Locale;
}) => {
  const t = useTranslations("publications");

  const isGroup = authors && authors.length > 1;
  const firstAuthor = authors?.[0];

  const [groupLogo, setGroupLogo] = useState<string | null>(null);

  useEffect(() => {
    if (isGroup) {
      getAuthorDataAction(authors, {
        groupName: t("groupName"),
        groupInitials: t("groupInitials"),
      }).then((data) => setGroupLogo(data.displayImageUrl ?? null));
    }
  }, [isGroup, authors, t]);

  if (isGroup && !groupLogo) {
    return (
      <div className="flex w-fit items-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  const displayName = isGroup ? t("groupName") : firstAuthor?.name || "";
  const displayInitials = isGroup
    ? t("groupInitials")
    : firstAuthor?.initials || getInitialsSync(firstAuthor?.name);

  const finalImageUrl = isGroup ? groupLogo : firstAuthor?.imageUrl || firstAuthor?.img?.asset?.url;

  return (
    <div className="flex w-fit items-center">
      <Avatar className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
        {finalImageUrl ? (
          <AvatarImage src={finalImageUrl} alt={displayName} className="object-cover" />
        ) : (
          <AvatarFallback className="text-sm font-medium text-slate-700">
            {displayInitials}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex flex-col justify-center px-2">
        <div className="flex items-center">
          <Typography as="span" variant="body-s" className="text-brand-gray-600">
            {displayName}
          </Typography>
        </div>
        {date && (
          <Typography variant="caption" className="text-brand-gray-600" asChild>
            <time dateTime={isoDate || date}>
              {new Date(date).toLocaleDateString(locale, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </time>
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Author;
