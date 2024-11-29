import { fail, isFail, isOk, ok, Result, wrapAsync } from '@/lib/result';
import { hashPassword } from '@/modules/auth/lib/password';
import { RegisterUserFormSchema } from '@/modules/auth/validation/schema';
import { db } from '@/modules/database/lib/db';
import { InsertPersistentUser, usersTable } from '@/modules/database/lib/schema';
import { logger } from '@/modules/logger/lib/server-logger';
import { FullUser } from '../types/user';
import { getFullUserByEmail } from './get-full-user-by-email';


export async function createNewUser(params: RegisterUserFormSchema): Promise<Result<FullUser>> {
  const userExists = await getFullUserByEmail(params);

  if (isOk(userExists)) {
    const msg = `Usuário com nome de usuário ${userExists.value.email} já existe!`;
    logger.error('createNewUser', msg);
    return fail('Não foi possível criar o usuário');
  }

  const password = await hashPassword(params.password);

  const data: InsertPersistentUser = {
    ...params,
    password,
  };

  const result = await wrapAsync(db.insert(usersTable).values(data).returning().execute());

  if (isFail(result)) {
    logger.error('createNewUser', result.fail);
    return fail('Não foi possível criar o usuário');
  }

  const user = result.value.at(0);

  if (!user) {
    return fail('Não foi possível criar o usuário');
  }

  return ok(user);
}
