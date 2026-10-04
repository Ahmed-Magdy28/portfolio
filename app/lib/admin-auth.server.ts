import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'change-me';

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const getAdminRoutePath = () => {
  const path = process.env.ADMIN_ROUTE_PATH ?? 'vault-7f3a-admin';
  return path.startsWith('/') ? path.slice(1) : path;
};

export async function isAuthenticatedAdmin(request?: Request): Promise<boolean> {
  let cookieVal: string | undefined;

  if (request) {
    const raw = request.headers.get('cookie') ?? '';
    const match = raw.match(/__portfolio_admin=([^;]+)/);
    cookieVal = match ? decodeURIComponent(match[1]) : undefined;
  } else {
    try {
      const cookieStore = await cookies();
      cookieVal = cookieStore.get('__portfolio_admin')?.value;
    } catch {
      // Outside request context
    }
  }

  return cookieVal === adminUsername;
}

export async function requireAdmin(request?: Request) {
  const authenticated = await isAuthenticatedAdmin(request);
  if (!authenticated) {
    throw new Error('Unauthorized');
  }
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set('__portfolio_admin', adminUsername, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('__portfolio_admin');
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  if (!safeCompare(username, adminUsername) || !safeCompare(password, adminPassword)) {
    return false;
  }
  return true;
}
