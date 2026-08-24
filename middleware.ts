import { NextResponse } from "next/server";

import { auth } from "@/auth";

const ROOT_HOSTS = new Set(["dylan.com.vn", "www.dylan.com.vn"]);
const PLAN_HOST = "plan.dylan.com.vn";
const ALLOWED_EMAILS = new Set(["leduy221200@gmail.com", "tranquynhnhu2601@gmail.com"]);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Behind the nginx reverse proxy, req.nextUrl.hostname reflects the
  // standalone server's own bind address (HOSTNAME=0.0.0.0), not the
  // externally requested host -- nginx forwards the real host via
  // Host/X-Forwarded-Host instead, so branch on that.
  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const hostname = forwardedHost.split(":")[0];
  const protocol = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${forwardedHost}`;

  if (ROOT_HOSTS.has(hostname)) {
    if (pathname === "/") {
      // Internal rewrite: must stay on the server's own internal nextUrl
      // origin (clone + change pathname), not the public origin above --
      // rewriting to an absolute URL on a *different* origin makes Next.js
      // treat it as a proxy fetch to that external host instead of serving
      // the local public/ file, which 404s.
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

    const email = req.auth?.user?.email;
    if (!email || !ALLOWED_EMAILS.has(email)) {
      const signInUrl = new URL("/signin", origin);
      signInUrl.searchParams.set("callbackUrl", `${origin}${pathname}`);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
