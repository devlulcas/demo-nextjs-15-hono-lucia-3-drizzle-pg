import { logger } from '@/modules/logger/lib/server-logger';
import { fromFullToPublicUser } from '@/modules/users/types/user';
import { cookies } from 'next/headers.js';
import { SESSION_COOKIE_NAME } from '../constants/auth';
import { validateSessionToken } from './session';

// Envólucro da Lucia para pegar os cookies do next
export async function validateSession() {
  const cookieJar = await cookies();
  const sessionCookie = cookieJar.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    logger.warn('Cookie de sessão não encontrado');
    return null;
  }

  const { session, user } = await validateSessionToken(sessionCookie.value);

  if (!session || !user) {
    logger.warn('Sessão não validada');
    return null;
  }

  return { sessionData: session, user: fromFullToPublicUser(user) };
}
