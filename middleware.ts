import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const PUBLIC_FILE = /\.(.*)$/;
    const nextPaths = [
        '/_next',
        '/favicon.ico',
        '/api',
        '/img',
        '/_next/static',
        '/_next/image'
    ];

    if (nextPaths.some((p) => path.startsWith(p)) || PUBLIC_FILE.test(path)) {
        return NextResponse.next();
    }
    if (
        path === '/register' ||
        path === '/login' ||
        path === '/forgot-password' ||
        path.includes('reset-password')
    ) {
        return NextResponse.next();
    }

    const session = await getToken({
        req,
        secret: process.env.AUTH_SECRET
    });

    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (path === '/add' && session.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}
