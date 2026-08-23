import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // A lot of people apparently have the default browser/system language as English
  // Client wants to still default to Polish, so we need to remove the header
  // Cookie functionality after manually selecting the language remains.
  const headers = new Headers(request.headers);
  headers.delete("Accept-Language");

  const newRequest = new NextRequest(request, {
    headers,
  });
  const intl = createMiddleware(routing);
  return intl(newRequest);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
