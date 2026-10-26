import {
  readFromStorage,
  removeFromStorage,
  STORAGE_KEYS,
  writeToStorage,
} from '@/services/local-storage.service';
import type { Session } from '@/types';

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Session>;
  return typeof candidate.user === 'string' && typeof candidate.loggedInAt === 'string';
}

export const localAuthRepository = {
  load(): Session | null {
    const session = readFromStorage<unknown>(STORAGE_KEYS.session);
    return isSession(session) ? session : null;
  },

  save(session: Session): void {
    writeToStorage(STORAGE_KEYS.session, session);
  },

  clear(): void {
    removeFromStorage(STORAGE_KEYS.session);
  },
};
