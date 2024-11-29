import { fail } from '@/lib/result';
import { CustomContext } from '@/modules/http/types/context';
import { logger } from '@/modules/logger/lib/server-logger';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { SESSION_COOKIE_NAME } from '../constants/auth';
import { validateSessionToken } from '../lib/session';

export const protectWithSessionMiddleware = createMiddleware<CustomContext>(async (c, next) => {
  const sessionCookie = getCookie(c, SESSION_COOKIE_NAME);

  logger.debug(sessionCookie);

  if (!sessionCookie) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  const { session, user } = await validateSessionToken(sessionCookie);

  if (!session || !user) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  c.set('session', session);
  c.set('currentUser', user);
  await next();
});
