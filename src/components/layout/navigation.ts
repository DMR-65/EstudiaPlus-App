import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Home,
  ListTodo,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Inicio', path: '/', icon: Home },
  { label: 'Perfil del estudiante', path: '/perfil', icon: UserRound },
  { label: 'Asignaturas', path: '/asignaturas', icon: BookOpen },
  { label: 'Tareas', path: '/tareas', icon: ListTodo },
  { label: 'Evaluaciones', path: '/evaluaciones', icon: ClipboardCheck },
  { label: 'Calendario', path: '/calendario', icon: CalendarDays },
];

export function getSectionTitle(pathname: string): string {
  const item = [...navigationItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((entry) => (entry.path === '/' ? pathname === '/' : pathname.startsWith(entry.path)));

  return item?.label ?? 'Estudia+';
}
