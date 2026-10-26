import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { CalendarPage } from '@/features/calendar/CalendarPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { EvaluationsPage } from '@/features/evaluations/EvaluationsPage';
import { ProfilePage } from '@/features/student-profile/ProfilePage';
import { SubjectsPage } from '@/features/subjects/SubjectsPage';
import { TasksPage } from '@/features/tasks/TasksPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="asignaturas" element={<SubjectsPage />} />
          <Route path="tareas" element={<TasksPage />} />
          <Route path="evaluaciones" element={<EvaluationsPage />} />
          <Route path="calendario" element={<CalendarPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
