import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // 1. Safety check for environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("Middleware Error: Missing Supabase Environment Variables");
        // Returning next() avoids the 500 error, although auth won't work correctly.
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        supabaseResponse = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { pathname } = request.nextUrl;

        // Skip middleware entirely for specific paths
        if (
            pathname.startsWith("/auth/") ||
            pathname.startsWith("/api/") ||
            pathname.startsWith("/_next/") ||
            pathname.includes(".") // fast check for files
        ) {
            return supabaseResponse;
        }

        // IMPORTANT: Refresh the session by calling getUser
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Public routes that don't require auth
        const publicRoutes = ["/", "/about", "/pricing", "/contact"];
        const isPublicRoute = publicRoutes.includes(pathname);

        // Auth routes - login and register
        const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
        const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith(route));

        // Protected routes - require authentication
        const protectedRoutes = ["/dashboard", "/admin", "/profile", "/certifications"];
        const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

        // If user exists and trying to access auth routes, redirect to dashboard
        if (user && isAuthRoute) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // If no user and trying to access protected routes, redirect to login
        if (!user && isProtectedRoute) {
            const redirectUrl = new URL("/login", request.url);
            redirectUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(redirectUrl);
        }

        return supabaseResponse;
    } catch (e) {
        console.error("Middleware Execution Error:", e);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - Static files (.svg, .png, .jpg, etc.)
         * - API routes
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
