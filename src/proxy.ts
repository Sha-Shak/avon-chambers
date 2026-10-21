import { NextResponse, type NextRequest } from "next/server";
import { normalizedPublicPath } from "@/lib/url-normalization";

export function proxy(request: NextRequest) {
  const pathname = normalizedPublicPath(request.nextUrl.pathname);
  if (pathname !== request.nextUrl.pathname) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|studio|_next|.*\\..*).*)"],
};
