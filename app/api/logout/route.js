import { NextResponse } from 'next/server';

export async function GET(req) {
  const response = NextResponse.redirect(new URL('/login', req.nextUrl.origin), 302);
  
  // Set 
  response.headers.set('Set-Cookie', `login=; expires=Thu, 21 Aug 2006 10:20:00 UTC; path=/`);
  
  return response;
}
