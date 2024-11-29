import { Session } from '@/modules/database/lib/schema';
import { FullUser } from '@/modules/users/types/user';

export type CustomContext = {
  Variables: {
    session: Session;
    currentUser: FullUser;
  };
};
