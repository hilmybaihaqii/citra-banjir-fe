import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const userSessionStr = request.cookies.get('user_session')?.value;  
  const pathname = request.nextUrl.pathname;
  const isAccessingDashboard = pathname.startsWith('/dashboard');
  const isAccessingHome = pathname === '/';

  if (isAccessingDashboard && (!token || !userSessionStr)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && userSessionStr) {
    try {
      const user = JSON.parse(userSessionStr);
      const userAgency = user.agency || '';
      let correctBasePath = '/dashboard/admin';
      switch (userAgency) {
        case 'BBWS':
          correctBasePath = '/dashboard/bbws';
          break;
        case 'BPBD_JABAR':
          correctBasePath = '/dashboard/bpbd-jabar';
          break;
        case 'BPBD_KAB':
          correctBasePath = '/dashboard/bpbd-kab';
          break;
        case 'BMKG':
          correctBasePath = '/dashboard/bmkg';
          break;
        case 'CITRA_BANJIR':
        case 'SYSTEM':
        default:
          correctBasePath = '/dashboard/admin';
          break;
      }

      if (isAccessingHome) {
        return NextResponse.redirect(new URL(correctBasePath, request.url));
      }
      if (isAccessingDashboard && !pathname.startsWith(correctBasePath)) {
        return NextResponse.redirect(new URL(correctBasePath, request.url));
      }

    } catch (error) {
      console.error("Middleware session parse error", error);
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      response.cookies.delete('user_session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cegat semua request paths KECUALI untuk:
     * - api (API routes dari Next.js jika ada)
     * - _next/static (file statis Next.js)
     * - _next/image (optimasi gambar Next.js)
     * - favicon.ico (ikon website)
     * - folder public lainnya seperti /images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};