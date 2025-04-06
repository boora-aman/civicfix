import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const isAdmin = token?.role === "ADMIN"
  const path = request.nextUrl.pathname

  // Public routes accessible to all users
  const publicRoutes = ["/", "/login", "/register", "/issues", "/issues/[id]"]

  // Routes that require authentication
  const authRoutes = ["/dashboard", "/issues/new"]

  // Routes that require admin access
  const adminRoutes = ["/admin"]

  // Check if the path is an admin route
  if (path.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Check if the path requires authentication
  if (authRoutes.some((route) => path.startsWith(route.replace("[id]", "")))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/issues/new", "/admin/:path*"],
}

