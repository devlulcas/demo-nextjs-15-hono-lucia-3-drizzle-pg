import { ok } from '@/lib/result';
import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import type { CustomContext } from '@/modules/http/types/context';
import { fromFullToPublicUser } from '@/modules/users/types/user';
import { Hono } from 'hono';

const app = new Hono<CustomContext>();

// User
app.use('/*', protectWithSessionMiddleware);

// Perfil próprio
app.get('/me', async (c) => {
  const user = c.get('currentUser');
  return c.json(ok(fromFullToPublicUser(user)));
});


export default app;
