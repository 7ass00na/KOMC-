import { NextResponse, type NextRequest } from "next/server";

function redirect308(req: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, req.url), 301);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!(pathname.startsWith("/en/") || pathname.startsWith("/ar/"))) return NextResponse.next();

  const lower = pathname.toLowerCase();
  if (lower !== pathname) return redirect308(req, lower);

  if (lower === "/en/about") return redirect308(req, "/en/about-us");
  if (lower === "/ar/about") return redirect308(req, "/ar/about-us");
  if (lower === "/en/contact") return redirect308(req, "/en/contact-us");
  if (lower === "/ar/contact") return redirect308(req, "/ar/contact-us");

  const res = NextResponse.next();
  res.headers.set("Content-Language", lower.startsWith("/ar/") ? "ar" : "en");
  return res;
}

export const config = {
  matcher: ["/en/:path*", "/ar/:path*"],
};
