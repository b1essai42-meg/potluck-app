// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 公開ページのリスト（認証不要）
  const publicPaths = ['/', '/login', '/register', '/invite'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // 未ログインで保護ページへのアクセス → /login にリダイレクト
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ログイン済みで /login または /register へのアクセス → /dashboard にリダイレクト
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
