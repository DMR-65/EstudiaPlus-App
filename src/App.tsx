import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/router';
import { theme } from '@/app/theme';
import { FeedbackProvider } from '@/components/feedback/FeedbackProvider';
import { AppDataProvider } from '@/features/app-data/AppDataContext';
import { AuthProvider } from '@/features/auth/AuthContext';

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <AuthProvider>
          <AppDataProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AppDataProvider>
        </AuthProvider>
      </FeedbackProvider>
    </ThemeProvider>
  );
}
