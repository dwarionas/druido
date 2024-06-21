import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from './lib/supabase/server';
import { updateSession } from './lib/supabase/middleware';

const loggedInRoutes = ["/chat"];
const loggedOutRoutes = ["/", "/login"];

export async function middleware(req: NextRequest) {
  await updateSession(req);

  const sb = createClient();
  const { data: { user }, error } = await sb.auth.getUser();

  if (!loggedInRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)) && !loggedOutRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  } else {
    if (!user && loggedInRoutes.some((path) => req.nextUrl.pathname == path)) {
      const absoluteUrl = new URL("/login", req.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    } else if (user && loggedOutRoutes.some((path) => req.nextUrl.pathname == path)) {
      const absoluteUrl = new URL("/chat", req.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    }
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}