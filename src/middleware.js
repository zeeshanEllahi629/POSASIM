import { NextResponse } from "next/server";

// Simple base64 decoder that works in Next.js Edge Middleware
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const isProtectedPath = (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) || pathname.startsWith("/api/pos");
  
  // Admin Login page path
  const isAdminAuthPath = pathname.startsWith("/admin/login");

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if token is missing
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    const payload = parseJwt(token);
    if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
      // Token is invalid or expired, redirect to login
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (isAdminAuthPath) {
    if (token) {
      const payload = parseJwt(token);
      if (payload && (!payload.exp || Date.now() < payload.exp * 1000)) {
        // User is already logged in, redirect to admin home
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: ["/admin/:path*", "/api/pos/:path*", "/admin/login"],
};
