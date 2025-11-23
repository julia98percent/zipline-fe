import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/find-account", "/appreciate"];

async function checkAuth(request: NextRequest): Promise<boolean> {
  try {
    const cookies = request.cookies.toString();

    if (!cookies) {
      return false;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
      console.error("NEXT_PUBLIC_SERVER_URL is not defined");
      return false;
    }

    const response = await fetch(`${serverUrl}/users/info`, {
      method: "GET",
      headers: {
        Cookie: cookies,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public route 체크
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Private route 체크: public route가 아니고, Next.js 내부 경로가 아니면 private (루트 경로 포함)
  const isPrivateRoute =
    !isPublicRoute &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/api");

  const isAuthenticated = await checkAuth(request);

  // Private route에 비인증 상태로 접근
  if (isPrivateRoute && !isAuthenticated) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Public route에 인증 상태로 접근 (로그인 페이지 등)
  if (isPublicRoute && isAuthenticated) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

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
