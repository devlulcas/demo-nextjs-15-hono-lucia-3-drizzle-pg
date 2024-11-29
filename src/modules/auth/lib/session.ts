import { toMilliseconds } from '@/lib/date';
import { db } from '@/modules/database/lib/db';
import { sessionsTable, usersTable, type Session } from '@/modules/database/lib/schema';
import type { FullUser } from '@/modules/users/types/user';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

// Gera um token criptográfico aleatório
export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

// Cria uma sessão no banco de dados com duração de 30 dias
export async function createSession(token: string, userId: number): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + toMilliseconds(30, 'days')),
  };

  await db.insert(sessionsTable).values(session);
  return session;
}

// Valida a sessão baseado no token passado
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({ user: usersTable, session: sessionsTable })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.id, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { user, session } = result[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionsTable).where(eq(sessionsTable.id, session.id));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - toMilliseconds(15, 'days')) {
    session.expiresAt = new Date(Date.now() + toMilliseconds(30, 'days'));
    await db.update(sessionsTable).set({ expiresAt: session.expiresAt }).where(eq(sessionsTable.id, session.id));
  }

  return { session, user };
}

// Invalida a sessão com base no seu ID, deletando o registro no banco
export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export type SessionValidationResult = { session: Session; user: FullUser } | { session: null; user: null };
