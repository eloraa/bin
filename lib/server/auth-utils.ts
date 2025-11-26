import { cookies } from 'next/headers';
import { verifyJWT, AuthPayload } from '@/lib/jwt';

const SESSION_COOKIE_NAME = 'bin_session';

/**
 * Get authenticated user payload from JWT cookie
 * @returns AuthPayload if authenticated, null otherwise
 */
export async function getAuthPayload(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return await verifyJWT(token);
}

/**
 * Boolean authentication check
 * @returns true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const payload = await getAuthPayload();
  return payload !== null;
}

/**
 * Require authentication - throws if not authenticated
 * Can be used in Server Components that must have auth
 * @returns AuthPayload if authenticated
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<AuthPayload> {
  const payload = await getAuthPayload();

  if (!payload) {
    throw new Error('Authentication required');
  }

  return payload;
}
