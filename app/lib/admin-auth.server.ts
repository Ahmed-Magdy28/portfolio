import { timingSafeEqual } from 'node:crypto';
import { createCookieSessionStorage, redirect } from 'react-router';

const ADMIN_USER_KEY = 'adminUser';

const sessionSecret =
  process.env.ADMIN_SESSION_SECRET ?? 'change-this-admin-session-secret-in-production';

const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'change-me';

const storage = createCookieSessionStorage({
  cookie: {
    name: '__portfolio_admin',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
  },
});

const safeCompare = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

export const getAdminRoutePath = () => process.env.ADMIN_ROUTE_PATH ?? 'vault-7f3a-admin';

export async function isAuthenticatedAdmin(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return session.get(ADMIN_USER_KEY) === adminUsername;
}

export async function requireAdmin(request: Request) {
  const authenticated = await isAuthenticatedAdmin(request);

  if (!authenticated) {
    throw redirect(`/${getAdminRoutePath()}`);
  }
}

export async function loginAdmin(request: Request, username: string, password: string) {
  if (!safeCompare(username, adminUsername) || !safeCompare(password, adminPassword)) {
    return null;
  }

  const session = await storage.getSession(request.headers.get('Cookie'));
  session.set(ADMIN_USER_KEY, adminUsername);

  return storage.commitSession(session);
}

export async function logoutAdmin(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return storage.destroySession(session);
}
