import { NextResponse } from "next/server";

import { auth } from "@/auth";

const ROOT_HOSTS = new Set(["dylan.com.vn", "www.dylan.com.vn"]);
const PLAN_HOST = "plan.dylan.com.vn";
const ALLOWED_EMAILS = new Set(["leduy221200@gmail.com", "tranquynhnhu2601@gmail.com"]);

export default auth((req) => {
  const { hostname, pathname } = req.nextUrl;

  if (ROOT_HOSTS.has(hostname)) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/Dylan_Porfolio.html", req.url));
    }
    return new NextResponse("Not Found", { status: 404 });
  }

  if (hostname === PLAN_HOST) {
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    const email = req.auth?.user?.email;
    if (!email || !ALLOWED_EMAILS.has(email)) {
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
