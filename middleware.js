import { NextResponse } from 'next/server';
// import { NextRequest } from 'next/server';
import { Auth } from "@/middleware/Auth"

console.log("middleware runs");

export function middleware(req) {

  // console.log(req.nextUrl.hostname);

  if (req.nextUrl.hostname != "prodi.vercel.app" && req.nextUrl.hostname != "localhost"){
    return new NextResponse(`Not Allowed from ${req.nextUrl.hostname} hostname`);
  }
  Auth(req);
  console.log('Middleware running on:', req.nextUrl.pathname);
  return NextResponse.next(); // Continue to the requested page
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'], // Runs only on routes under /dashboard
};
