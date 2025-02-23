/* import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log(request);

  return NextResponse.redirect(new URL('/about', request.url));
} */

// import { auth } from './app/_lib/auth';

// Explicit way of:
// import { auth } from '@/app/_lib/auth';
// export const middleware = auth;

export { auth as middleware } from '@/app/_lib/auth';

export const config = {
  matcher: ['/account'],
};
