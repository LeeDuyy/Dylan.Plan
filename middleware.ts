import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROOT_HOSTS = new Set(["dylan.com.vn", "www.dylan.com.vn", "localhost"]);
// The portfolio page loads these résumé files into iframes via a plain
// `src=` fetch (same-origin request, not a Next.js route) -- without this
// allowlist the catch-all 404 below for ROOT_HOSTS would block that fetch.
const ROOT_STATIC_ALLOW = new Set([
  "/Senior_Software_Engineer_DuyLe.html",
  "/TechLead_DuyLe.html",
  "/Senior_Software_Engineer_DuyLe.pdf",
  "/TechLead_DuyLe.pdf",
  "/favicon.svg"
]);
const PLAN_HOSTS = new Set(["plan.dylan.com.vn", "plan.127.0.0.1", "plan.localhost"]);
const LOCAL_PLAN_HOSTS = new Set(["plan.127.0.0.1", "plan.localhost"]);
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
    if (ROOT_STATIC_ALLOW.has(pathname)) {
      return NextResponse.next();
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  if (PLAN_HOSTS.has(hostname)) {
    if (pathname.startsWith("/api/auth") || pathname === "/signin") {
      return NextResponse.next();
    }

    const isLocal = LOCAL_PLAN_HOSTS.has(hostname);

    // Skip auth entirely for the local-only plan hosts while developing.
    // Gated on NODE_ENV too so this can never become a live bypass -- these
    // hostnames only resolve to loopback anyway, but the extra check is free.
    if (isLocal && process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    // getToken reads/verifies the session JWT cookie directly -- unlike the
    // auth() wrapper, it never touches req.url/origin, so it's safe to use
    // here regardless of the AUTH_URL quirk above. secureCookie must be
    // forced to true in production: nginx terminates TLS and proxies to this
    // app over plain HTTP, so req's own protocol looks insecure, and getToken
    // would otherwise default to looking for "authjs.session-token" instead
    // of the "__Secure-authjs.session-token" cookie actually being set for
    // this (genuinely HTTPS-only) site, never finding a real session. Local
    // dev hosts run over plain http with no proxy, so the cookie really is
    // unsecured and this must stay false there.
    const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie: !isLocal });
    const email = typeof token?.email === "string" ? token.email : undefined;

    if (!email || !ALLOWED_EMAILS.has(email)) {
      const protocol = req.headers.get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
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
