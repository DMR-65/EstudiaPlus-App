export const STORAGE_KEYS = {
  data: 'estudia-plus:data:v1',
  session: 'estudia-plus:session:v1',
} as const;

export class StorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'StorageError';
  }
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readFromStorage<T>(key: string): T | null {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(key);
    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
}

export function writeToStorage(key: string, value: unknown): void {
  const storage = getStorage();
  if (!storage) {
    throw new StorageError('El almacenamiento local no está disponible.');
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new StorageError(
      'No fue posible guardar los datos en el almacenamiento local.',
      { cause: error },
    );
  }
}

export function removeFromStorage(key: string): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // El cierre de sesión en memoria sigue siendo válido aunque falle el almacenamiento.
  }
}
