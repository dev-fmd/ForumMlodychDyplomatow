import React from "react";
import type {
  NavigationFooter,
  NavigationHeader,
  NavigationLinks,
} from "../../sanity/queries/navigation";
import { LocaleButtons } from "../Header/LocaleButtons";
import { FMDLogo } from "../Icons/FMDLogo";
import { Link } from "../ui/link";
import { Separator } from "../ui/separator";
import SocialIcons from "../ui/social-icons";
import Typography from "../ui/typography";

const Footer = async ({
  navigation,
  footer,
  header,
}: {
  navigation: NavigationLinks;
  footer: NavigationFooter;
  header: NavigationHeader;
}) => {
  return (
    <footer className="mx-auto flex w-full max-w-(--width-content-max) flex-col gap-4 px-6 py-8 text-gray-600">
      <FMDLogo logo={header.logo} text={header.logoText} />
      <div className="grid grid-cols-1 gap-4 desktop:grid-cols-[1fr_1fr_auto] desktop:flex-row">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-4">
            <div className="flex flex-col items-start gap-4">
              {footer.contactInfo?.email && (
                <Link variant="nav" size="inline" href={`mailto:${footer.contactInfo.email}`}>
                  {footer.contactInfo.email}
                </Link>
              )}
              {footer.contactInfo?.phone && (
                <Link variant="nav" size="inline" href={`tel:${footer.contactInfo.phone}`}>
                  {footer.contactInfo.phone}
                </Link>
              )}
            </div>
            {footer.contactInfo?.socials && <SocialIcons socials={footer.contactInfo.socials} />}
          </div>
        </div>
        <Separator className="desktop:hidden" />
        <div className="items-between flex flex-col gap-4">
          <Typography className="whitespace-break-spaces">{footer.contactInfo?.address}</Typography>
          <Typography className="whitespace-break-spaces">
            {footer.contactInfo?.identifiers}
          </Typography>
        </div>
        <Separator className="desktop:hidden" />
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-col items-start">
            {navigation?.map((link) =>
              link._type === "link" ? (
                <Link
                  key={link._key}
                  link={link.link}
                  variant="nav"
                  size="inline"
                  className="px-3 desktop:px-2"
                >
                  <Typography variant="body-m" className="font-normal">
                    {link.link.text}
                  </Typography>
                </Link>
              ) : (
                <div key={link._key} className="flex flex-col items-start">
                  <Typography variant="body-m" className="px-3 desktop:px-2">
                    {link.name}
                  </Typography>
                  <div className="flex flex-col items-start pl-4 desktop:pr-4">
                    {link.items?.map((item) => (
                      <Link
                        key={item._key}
                        size="inline"
                        variant="nav"
                        className="px-3 desktop:px-2"
                        link={item}
                      >
                        <Typography variant="body-m" className="font-normal">
                          {item.text}
                        </Typography>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          <LocaleButtons />
        </div>
      </div>
      <Separator />
      <div className="flex w-full flex-col-reverse desktop:flex-row desktop:items-center desktop:justify-between">
        <Typography variant="caption">{footer.copyright}</Typography>
        <div className="flex flex-col items-start justify-end desktop:flex-row desktop:gap-2">
          {footer.additionalLinks?.map((link, index) => (
            <React.Fragment key={link._key}>
              <Typography asChild variant="caption">
                <Link link={link} variant="nav" className="font-normal" size="inline">
                  {link.text}
                </Link>
              </Typography>
              {index < (footer.additionalLinks?.length ?? 0) - 1 && (
                <Separator orientation="vertical" className="hidden desktop:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {(footer.madeByLink || footer.madeByText) && (
        <>
          <Separator />
          <div className="flex w-full flex-row items-center justify-start whitespace-pre">
            <Typography as="span" variant="caption">
              {footer.madeByText}{" "}
            </Typography>
            {footer.madeByLink && (
              <Link link={footer.madeByLink} variant="text" className="font-normal" size="inline">
                <Typography as="span" variant="caption">
                  {footer.madeByLink.text}
                </Typography>
              </Link>
            )}
          </div>
        </>
      )}
    </footer>
  );
};

export default Footer;
