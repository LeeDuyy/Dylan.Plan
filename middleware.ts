import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROOT_HOSTS = new Set(["dylan.com.vn", "www.dylan.com.vn"]);
const PLAN_HOST = "plan.dylan.com.vn";
const ALLOWED_EMAILS = new Set(["leduy221200@gmail.com", "tranquynhnhu2601@gmail.com"]);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Behind the nginx reverse proxy, req.nextUrl.hostname reflects the
  // standalone server's own bind address (HOSTNAME=0.0.0.0), not the
  // externally requested host -- nginx forwards the real host via
  // Host/X-Forwarded-Host instead, so branch on that.
  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const hostname = forwardedHost.split(":")[0];

  if (ROOT_HOSTS.has(hostname)) {
    if (pathname === "/") {
      // Internal rewrite: must stay on the server's own internal nextUrl
      // origin (clone + change pathname), not the public origin -- rewriting
      // to an absolute URL on a *different* origin makes Next.js treat it as
      // a proxy fetch to that external host instead of serving the local
      // public/ file, which 404s. This is also why this middleware never
      // wraps requests through next-auth's auth() helper (see below): that
      // helper rewrites req's URL to AUTH_URL's origin for every request it
      // touches, which would break this rewrite for root-domain traffic too.
      const rewriteUrl = req.nextUrl.clone();
      rewriteUrl.pathname = "/Dylan_Porfolio.html";
      return NextResponse.rewrite(rewriteUrl);
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  if (hostname === PLAN_HOST) {
    if (pathname.startsWith("/api/auth") || pathname === "/signin") {
      return NextResponse.next();
    }

    // getToken reads/verifies the session JWT cookie directly -- unlike the
    // auth() wrapper, it never touches req.url/origin, so it's safe to use
    // here regardless of the AUTH_URL quirk above. secureCookie must be
    // forced to true: nginx terminates TLS and proxies to this app over
    // plain HTTP, so req's own protocol looks insecure, and getToken would
    // otherwise default to looking for "authjs.session-token" instead of
    // the "__Secure-authjs.session-token" cookie actually being set for
    // this (genuinely HTTPS-only) site, never finding a real session.
    const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: true });
    const email = typeof token?.email === "string" ? token.email : undefined;

    if (!email || !ALLOWED_EMAILS.has(email)) {
      const protocol = req.headers.get("x-forwarded-proto") ?? "https";
      const origin = `${protocol}://${forwardedHost}`;
      const signInUrl = new URL("/signin", origin);
      signInUrl.searchParams.set("callbackUrl", `${origin}${pathname}`);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
