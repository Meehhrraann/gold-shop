import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  publicRoutes,
  publicRoutePatterns,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Check if user has a session token (NextAuth session cookie)
  const sessionToken =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = !!sessionToken;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // Check if the route is a public route (exact match)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Check if the route matches any public route pattern (regex)
  const isPublicRoutePattern = publicRoutePatterns.some((pattern) =>
    pattern.test(nextUrl.pathname),
  );

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Handle auth routes (login, register, etc.)
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect logged-in users away from auth pages
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // Allow public routes and public route patterns
  if (isPublicRoute || isPublicRoutePattern) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
