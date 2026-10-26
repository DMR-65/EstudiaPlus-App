import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/router';
import { theme } from '@/app/theme';
import { FeedbackProvider } from '@/components/feedback/FeedbackProvider';
import { AppDataProvider } from '@/features/app-data/AppDataContext';
import { AuthProvider } from '@/features/auth/AuthContext';
import { localAcademicRepository } from '@/services/app-data.repository';
import { localAuthRepository } from '@/services/auth.repository';
import type { AppData } from '@/types';

interface RenderAppOptions extends Omit<RenderOptions, 'wrapper'> {
  authenticated?: boolean;
  appData?: AppData;
}

export function AppProviders({ children }: { children: ReactElement }) {
  return (
    <ThemeProvider theme={theme}>
      <FeedbackProvider>
        <AuthProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </AuthProvider>
      </FeedbackProvider>
    </ThemeProvider>
  );
}

export function renderApp(route = '/', options: RenderAppOptions = {}) {
  const { authenticated = true, appData, ...renderOptions } = options;

  if (authenticated) {
    localAuthRepository.save({
      user: 'estudiante.demo',
      loggedInAt: new Date().toISOString(),
    });
  }

  if (appData) {
    localAcademicRepository.save(appData);
  }

  return render(
    <ThemeProvider theme={theme}>
      <FeedbackProvider>
        <AuthProvider>
          <AppDataProvider>
            <MemoryRouter
              initialEntries={[route]}
              future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
            >
              <AppRoutes />
            </MemoryRouter>
          </AppDataProvider>
        </AuthProvider>
      </FeedbackProvider>
    </ThemeProvider>,
    renderOptions,
  );
}
