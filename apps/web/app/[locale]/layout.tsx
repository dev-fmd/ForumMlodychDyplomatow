import { routing } from "@/i18n/routing";
import { runQuery } from "@/sanity/groqd";
import { SanityLive } from "@/sanity/live";
import { mapMetadata } from "@/sanity/metadata/mapMetadata";
import { SanityPreview } from "@/sanity/preview/SanityPreview";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Inter, Libre_Baskerville, Lora, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import SvgCacheProvider from "react-inlinesvg/provider";
import { Toaster } from "sonner";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { createJsonLdOrganization } from "../../lib/seo";
import { intlQuery } from "../../sanity/queries/intl";
import { navigationQuery } from "../../sanity/queries/navigation";
import { globalMetadataQuery, seoOrgQuery } from "../../sanity/queries/seo";
import "./globals.css";

/** This is the base metadata for the entire project, it will cascade down to subpages
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function */

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await runQuery(globalMetadataQuery, {
    parameters: {},
    stega: false, // always set `stega: false` in Next's `generate` functions
  });
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_ORIGIN),
    ...mapMetadata(data?.seo),
    icons: {
      icon: data?.logo?.url
        ? [{ url: data?.logo?.url, type: data?.logo?.mimeType!, sizes: "any" }]
        : [],
      apple: data?.logo?.url
        ? [{ url: data?.logo?.url, type: data?.logo?.mimeType!, sizes: "any" }]
        : [],
    },
    manifest: "/api/manifest.json",
  };
}

/** Since we are using a dynamic route segment for the [locale] param, we need to
 *  instruct Next.js what params exist so that it may pre-generate pages */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Setup font optimization
 * @see https://nextjs.org/docs/app/getting-started/fonts */

const libreBaskerville = Libre_Baskerville({
  variable: "--font-base-libre-baskerville",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-base-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-base-oswald",
  subsets: ["latin"],
});
const lora = Lora({
  variable: "--font-base-lora",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: paramLocale } = await params;
  const locale = paramLocale ?? routing.defaultLocale;
  // Validating locale at root layout ensures it is valid everywhere
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale); // Enables static rendering, this should be done in every page/layout
  const [{ data: translations }, { data: navigation }, { data: orgSeo }] = await Promise.all([
    runQuery(intlQuery, { parameters: { locale } }),
    runQuery(navigationQuery, { parameters: { locale } }),
    runQuery(seoOrgQuery, { stega: false }),
  ]);

  const orgJsonLd = createJsonLdOrganization(orgSeo);
  return (
    <html lang={locale}>
      <body
        className={`${libreBaskerville.variable} ${inter.variable} ${oswald.variable} ${lora.variable} relative bg-white font-inter text-gray-900 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NuqsAdapter
          defaultOptions={{
            scroll: false,
            clearOnDefault: true,
          }}
        >
          <SvgCacheProvider>
            <NextIntlClientProvider messages={translations as any}>
              <Header header={navigation!.header} navigation={navigation!.navigation} />
              <main id="main-content" className="w-full" tabIndex={-1}>
                {children}
              </main>
              <Footer
                footer={navigation!.footer}
                navigation={navigation!.navigation}
                header={navigation!.header}
              />
              <Toaster />
              <SanityPreview />
            </NextIntlClientProvider>
          </SvgCacheProvider>
        </NuqsAdapter>
      </body>
      <SanityLive />
    </html>
  );
}
