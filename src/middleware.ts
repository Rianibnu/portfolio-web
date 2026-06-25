import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth API routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAdminRoute) {
    // Not authenticated — redirect to login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Server-side session expiry check: if the token was issued too long ago
    // (30 minutes), force re-authentication even if the JWT hasn't expired yet.
    // This acts as defense-in-depth alongside the client-side idle tracker.
    const tokenIssuedAt = (token.iat as number) || 0;
    const now = Math.floor(Date.now() / 1000);
    const SESSION_MAX_AGE_SECONDS = 30 * 60;

    if (now - tokenIssuedAt > SESSION_MAX_AGE_SECONDS) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("reason", "expired");
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

      // Clear the session cookie
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("__Secure-next-auth.session-token");
      return response;
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");
  // Prevent MIME sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  // XSS protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Referrer policy — don't leak admin URLs
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions policy — restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // Prevent caching of admin pages (sensitive content)
  if (isAdminRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
