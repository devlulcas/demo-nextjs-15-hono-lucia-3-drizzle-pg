import { fail, isFail, ok, Result, wrapAsync } from '@/lib/result';
import { db } from '@/modules/database/lib/db';
import { safeGetFirst } from '@/modules/database/lib/helpers';
import { usersTable } from '@/modules/database/lib/schema';
import { logger } from '@/modules/logger/lib/server-logger';
import { eq } from 'drizzle-orm';
import { FullUser } from '../types/user';

export async function getFullUserByEmail(params: { email: string }): Promise<Result<FullUser>> {
  const userResult = await wrapAsync(
    db.select().from(usersTable).where(eq(usersTable.email, params.email)).limit(1).execute().then(safeGetFirst),
  );

  if (isFail(userResult)) {
    logger.error('getUserByUsernameQuery', userResult.fail);
    return fail('Falha ao buscar usuário pelo e-mail');
  }

  if (!userResult.value) {
    const msg = `${params.email} não encontrado`;
    logger.info('getUserByUsernameQuery', msg);
    return fail(msg);
  }

  return ok(userResult.value);
}
