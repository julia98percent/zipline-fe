import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/find-account", "/appreciate"];

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const cookies = request.cookies.toString();
    console.log("[Middleware checkAuth] Cookies:", cookies ? "EXISTS" : "EMPTY");

    if (!cookies) {
      console.log("[Middleware checkAuth] ❌ No cookies found");
      return false;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    console.log("[Middleware checkAuth] Server URL:", serverUrl);

    if (!serverUrl) {
      console.error("[Middleware checkAuth] ❌ NEXT_PUBLIC_SERVER_URL is not defined");
      return false;
    }

    console.log("[Middleware checkAuth] Fetching /users/info...");
    const response = await fetch(`${serverUrl}/users/info`, {
      method: "GET",
      headers: {
        Cookie: cookies,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("[Middleware checkAuth] Response status:", response.status);
    console.log("[Middleware checkAuth] Response ok:", response.ok);

    if (!response.ok) {
      const responseText = await response.text();
      console.error("[Middleware checkAuth] ❌ Response body:", responseText);
    }

    return response.ok;
  } catch (error) {
    console.error("[Middleware checkAuth] ❌ Exception:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("\n[Middleware] ===== Request to:", pathname, "=====");

  // Public route 체크
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  console.log("[Middleware] Is public route:", isPublicRoute);

  // Private route 체크: public route가 아니고, Next.js 내부 경로가 아니면 private (루트 경로 포함)
  const isPrivateRoute =
    !isPublicRoute &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api");
  console.log("[Middleware] Is private route:", isPrivateRoute);

  const isAuthenticated = await checkAuth(request);
  console.log("[Middleware] Is authenticated:", isAuthenticated);

  // Private route에 비인증 상태로 접근
  if (isPrivateRoute && !isAuthenticated) {
    console.log("[Middleware] 🔄 Redirecting to /sign-in (unauthenticated access to private route)");
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Public route에 인증 상태로 접근 (로그인 페이지 등)
  if (isPublicRoute && isAuthenticated) {
    console.log("[Middleware] 🔄 Redirecting to / (authenticated access to public route)");
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  console.log("[Middleware] ✅ Allowing access\n");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
