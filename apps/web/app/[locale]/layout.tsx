import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { sanityFetch, SanityLive } from "@/sanity/live";
import { Toaster } from "sonner";
import { SanityPreview } from "@/sanity/preview/SanityPreview";
import { mapMetadata } from "@/sanity/metadata/mapMetadata";
import { q } from "@/sanity/groqd";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/locales";
import ChangeLocaleLink from "../../components/ChangeLocaleLink";

/** This is the base metadata for the entire project, it will cascade down to subpages
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function */

export async function generateMetadata(): Promise<Metadata> {
  const seo = q.star
    .filterByType("settings")
    .slice(0)
    .project((sub) => ({ seo: sub.field("seo") }));
  const { data } = await sanityFetch({
    query: seo.query,
    params: { page: "settings" },
    stega: false, // always set `stega: false` in Next's `generate` functions
  });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_ORIGIN),
    ...mapMetadata(seo.parse(data)),
  };
}

/** Since we are using a dynamic route segment for the [locale] param, we need to
 *  instruct Next.js what params exist so that it may pre-generate pages */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Setup font optimization
 * @see https://nextjs.org/docs/app/getting-started/fonts */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validating locale at root layout ensures it is valid everywhere
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale); // Enables static rendering, this should be done in every page/layout

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <div className="flex justify-center gap-3 uppercase pt-5">
            {locales.map((l) => (
              <ChangeLocaleLink key={l} locale={l}>
                {l.toLocaleUpperCase()}
              </ChangeLocaleLink>
            ))}
          </div>
          {children}
          <Toaster />
          <SanityPreview />
        </NextIntlClientProvider>
      </body>
      <SanityLive />
    </html>
  );
}
