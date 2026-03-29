import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { isDiscordAuthConfigured } from "@/lib/auth-env";

const protectedPaths = ["/", "/admin", "/status"];

export default async function proxy(request: NextRequest) {
  if (!isDiscordAuthConfigured()) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isProtected = protectedPaths.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`),
  );

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
