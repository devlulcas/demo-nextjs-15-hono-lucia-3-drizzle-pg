import { fail, isFail, isOk, ok, wrapAsync } from '@/lib/result';
import { SESSION_COOKIE_NAME } from '@/modules/auth/constants/auth';
import { comparePassword } from '@/modules/auth/lib/password';
import { createSession, generateSessionToken, invalidateSession } from '@/modules/auth/lib/session';
import type { CustomContext } from '@/modules/http/types/context';
import { logger } from '@/modules/logger/lib/server-logger';
import { createNewUser } from '@/modules/users/use-cases/create-new-user';
import { getFullUserByEmail } from '@/modules/users/use-cases/get-full-user-by-email';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { loginUserFormSchema, registerUserFormSchema } from '../validation/schema';

const app = new Hono<CustomContext>();

app.post('/register', async (c) => {
  const user = c.get('currentUser');

  const unauthenticatedResponse = c.json(
    fail(
      'Falha ao se autenticar! Verifique seu nome de usuário, senha ou garanta que não está logado para tentar novamente',
    ),
  );

  if (user) {
    logger.warn(`Tentativa de cadastro de usuário já autenticado: ${user.email}`);
    throw new HTTPException(401, { res: unauthenticatedResponse });
  }

  const dataResult = registerUserFormSchema.safeParse(await c.req.json());

  if (!dataResult.success) {
    logger.info('Dados incorretos no cadastro');
    return c.json(fail('Você precisa informar seus dados corretamente'), 400);
  }

  const userResult = await getFullUserByEmail({ email: dataResult.data.email });

  if (isOk(userResult)) {
    logger.info('Dados incorretos no cadastro');
    throw new HTTPException(401, { res: unauthenticatedResponse });
  }

  const newUserResult = await createNewUser(dataResult.data)

  if (isFail(newUserResult)) {
    return c.json(newUserResult, 500);
  }

  const token = generateSessionToken();
  const session = await createSession(token, newUserResult.value.id);

  c.set('currentUser', newUserResult.value);
  c.set('session', session);
  setCookie(c, SESSION_COOKIE_NAME, token);

  return c.json(ok('Sucesso!'));
});

app.post('/login', async (c) => {
  const user = c.get('currentUser');

  const unauthenticatedResponse = c.json(
    fail(
      'Falha ao se autenticar! Verifique seu nome de usuário, senha ou garanta que não está logado para tentar novamente',
    ),
  );

  if (user) {
    logger.warn(`Tentativa de login de usuário já autenticado: ${user.email}`);
    throw new HTTPException(401, { res: unauthenticatedResponse });
  }

  const dataResult = loginUserFormSchema.safeParse(await c.req.json());

  if (!dataResult.success) {
    logger.info('Dados incorretos no login');
    return c.json(fail('Você precisa informar seus dados para prosseguir'), 400);
  }

  const userResult = await getFullUserByEmail({ email: dataResult.data.email });

  if (isFail(userResult)) {
    throw new HTTPException(401, { res: unauthenticatedResponse });
  }

  const passwordMatches = await comparePassword(dataResult.data.password, userResult.value.password);

  if (!passwordMatches) {
    throw new HTTPException(401, { res: unauthenticatedResponse });
  }

  const token = generateSessionToken();
  const session = await createSession(token, userResult.value.id);

  c.set('currentUser', userResult.value);
  c.set('session', session);
  setCookie(c, SESSION_COOKIE_NAME, token);

  return c.json(ok('Sucesso!'));
});

app.post('/logout', async (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE_NAME);

  if (!sessionId) {
    const errorRes = c.json(fail('Você precisa entrar para poder sair'));
    throw new HTTPException(401, { res: errorRes });
  }

  const invalidateResult = await wrapAsync(invalidateSession(sessionId));

  if (isFail(invalidateResult)) {
    const errorRes = c.json(fail('Algo deu errado!'));
    throw new HTTPException(500, { res: errorRes });
  }

  setCookie(c, SESSION_COOKIE_NAME, 'banana');

  return c.json(ok('Sucesso! Sessão encerrada.'));
});


export default app;
