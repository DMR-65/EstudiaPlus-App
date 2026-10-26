import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import { localAuthRepository } from '@/services/auth.repository';
import type { Session } from '@/types';

interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  login: (user: string, remember?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => localAuthRepository.load());
  const { notify } = useFeedback();

  const login = useCallback(
    (user: string, remember = true) => {
      const nextSession: Session = {
        user: user.trim(),
        loggedInAt: new Date().toISOString(),
      };

      if (remember) {
        try {
          localAuthRepository.save(nextSession);
        } catch {
          notify(
            'No fue posible guardar la sesión, pero puedes seguir usando la aplicación.',
            'warning',
          );
        }
      } else {
        localAuthRepository.clear();
      }

      setSession(nextSession);
    },
    [notify],
  );

  const logout = useCallback(() => {
    localAuthRepository.clear();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return context;
}
