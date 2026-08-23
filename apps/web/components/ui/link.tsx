import { Link as BaseLink } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import type { InferFragmentType } from "groqd";
import { ExternalLink } from "lucide-react";
import { useLocale } from "next-intl";
import React from "react";
import type { linkFragment } from "../../sanity/queries/linkFragment";
import { buttonVariants } from "./button";
import { stegaClean } from "next-sanity";
type LinkType = InferFragmentType<typeof linkFragment>;
type LinkOrHref =
  | {
      link: LinkType;
      href?: undefined;
      searchParams?: undefined;
    }
  | {
      href: string;
      link?: undefined;
      searchParams?: undefined;
    }
  | {
      href?: string;
      link?: undefined;
      searchParams?: Record<string, string | string[] | undefined>;
    };
const slugsByType = {
  page: "/",
  division: "/division/",
  publication: "/publications/",
} satisfies Record<Exclude<LinkType["linkType"], "href" | null | undefined>, string>;
export type LinkProps = Omit<React.ComponentProps<typeof BaseLink>, "href"> &
  VariantProps<typeof buttonVariants> & {
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    openInNewTab?: boolean | null;
    noExternalIcon?: boolean;
    currentPathname?: string;
  } & LinkOrHref;
export const Link = ({
  children,
  className,
  variant = "link",
  size = "m",
  iconLeft = null,
  openInNewTab = false,
  iconRight = null,
  link,
  href,
  searchParams,
  currentPathname,
  noExternalIcon = false,
  ...props
}: LinkProps) => {
  const localeBase = useLocale();
  const locale = localeBase === "pl" ? "" : `/${localeBase}`;
  const getHref = ():
    | string
    | { pathname?: string; query: Record<string, string | string[] | undefined> } => {
    if (searchParams) {
      return {
        pathname: stegaClean(href),
        query: searchParams,
      };
    }
    if (href) {
      return stegaClean(href);
    }
    const cleanLink = stegaClean(link);
    if (!cleanLink?.linkType) {
      console.warn("Link component received a link object with null or undefined linkType", link);
      return "#";
    }
    if (cleanLink.linkType === "href") {
      return cleanLink.href || "#";
    }
    if (cleanLink.linkType === "page" && cleanLink.href === "home") {
      return `/`;
    }
    return `${slugsByType[cleanLink.linkType]}${cleanLink.href}`;
  };
  const isExternal = link?.linkType === "href" || href?.startsWith("http");
  const rightIcon =
    isExternal && !noExternalIcon ? <ExternalLink className="size-[1em]" /> : iconRight;
  const fullHref = getHref();
  const isCurrent =
    currentPathname && typeof fullHref === "string" && currentPathname === `${locale}${fullHref}`;
  return (
    <BaseLink
      href={fullHref}
      target={link?.openInNewTab || openInNewTab ? "_blank" : undefined}
      data-current={isCurrent ? true : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {iconLeft}
      {children ?? (link ? link.text : null)}
      {rightIcon}
    </BaseLink>
  );
};
