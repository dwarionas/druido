import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { createClient } from "@/lib/supabase/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/auth"];

export async function middleware(req: NextRequest) {
	await updateSession(req);

	const sb = createClient();
	const { data: { user }, error } = await sb.auth.getUser();

  	// Rewrites
	// if (user && req.nextUrl.pathname.startsWith('/')) {
	// 	return NextResponse.rewrite(new URL('/dashboard', req.url))
	// }

  	// routes handler
	const isProtectedRoute = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));
	const isPublicRoute = publicRoutes.some((path) => req.nextUrl.pathname.startsWith(path));
	
	if (!isProtectedRoute && !isPublicRoute) {
		return NextResponse.next();
	}
	
	if (!user && isProtectedRoute) {
		const absoluteUrl = new URL("/auth", req.nextUrl.origin);
		return NextResponse.redirect(absoluteUrl.toString());
	}
	
	if (user && isPublicRoute) {
		const absoluteUrl = new URL("/dashboard", req.nextUrl.origin);
		return NextResponse.redirect(absoluteUrl.toString());
	}

  	// other requests
	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}