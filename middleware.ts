import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
    const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard")

    // Redirect admins away from dashboard to admin page
    if (isAdmin && isDashboardRoute) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Redirect non-admins away from admin routes
    if (!isAdmin && isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}

