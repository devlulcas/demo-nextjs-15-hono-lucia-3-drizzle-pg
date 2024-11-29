import type { SelectPersistentUser } from '../../database/lib/schema';

export type FullUser = SelectPersistentUser;

export type PublicUser = Omit<SelectPersistentUser, 'password'>;

export const fromFullToPublicUser = (u: FullUser): PublicUser => {
  const { password: _password, ...user } = u;
  return user;
};
