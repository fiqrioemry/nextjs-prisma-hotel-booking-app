import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const unauthenticatedPaths = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const userOnlyPaths = ["/", "/contact", "/about", "/hotels"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = getSessionCookie(request);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // unsigned & akses /user/*
  if (!session && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // unsigned & akses /admin/*
  if (!session && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (
    session &&
    pathname.startsWith("/admin") &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  if (session && pathname.startsWith("/user") && session.user.role !== "USER") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // prevent admin access to user-only pages
  if (session && session.user.role === "ADMIN") {
    const isUserOnly =
      userOnlyPaths.includes(pathname) || pathname.startsWith("/hotels"); // termasuk /hotels/:id, /hotels/:id/rooms

    if (isUserOnly) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // signed in tapi coba buka halaman signin/signup dll
  if (sessionCookie && unauthenticatedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/",
    "/contact",
    "/about",
    "/hotels/:path*",
    "/user/:path*",
    "/admin/:path*",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};
