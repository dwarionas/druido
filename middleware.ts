import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from './lib/supabase/server';
import { updateSession } from './lib/supabase/middleware';
import subdomains from './subdomains.json'

const loggedInRoutes = ["/dashboard"];
const loggedOutRoutes = ["/", "/auth"];

export async function middleware(req: NextRequest) {
  //
  await updateSession(req);

  //
  const sb = createClient();
  const { data: { user }, error } = await sb.auth.getUser();

  if (!loggedInRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)) && !loggedOutRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  } else {
    if (!user && loggedInRoutes.some((path) => req.nextUrl.pathname == path)) {
      const absoluteUrl = new URL("/auth", req.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    } else if (user && loggedOutRoutes.some((path) => req.nextUrl.pathname == path)) {
      const absoluteUrl = new URL("/dashboard", req.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    }
  }

  // subdomains
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  const allowedDomains = ["localhost:3000", "druido.cc"];
  const isAllowedDomain = allowedDomains.some(domain => hostname?.includes(domain));

  const subdomain = hostname?.split('.')[0];

  if (isAllowedDomain && !subdomains.some(d => d.subdomain === subdomain)) {
    return NextResponse.next();
  }

  const subdomainData = subdomains.find(d => d.subdomain === subdomain);

  if (subdomainData) {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  // END
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