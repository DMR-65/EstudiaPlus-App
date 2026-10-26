import {
  addDays,
  differenceInCalendarDays,
  format,
  isValid,
  parseISO,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { TIME_ZONE } from '@/utils/constants';

function santiagoParts(date: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  return Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  );
}

export function getTodayInSantiago(now = new Date()): string {
  const parts = santiagoParts(now);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function parseDateOnly(value: string): Date {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : new Date(Number.NaN);
}

export function formatDate(value: string | Date | undefined): string {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : parseDateOnly(value);
  return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: es }) : '—';
}

export function formatLongDate(value: string | Date | undefined): string {
  if (!value) {
    return '—';
  }

  const date = value instanceof Date ? value : parseDateOnly(value);
  return isValid(date) ? format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }) : '—';
}

export function formatCurrentDate(now = new Date()): string {
  const formatted = new Intl.DateTimeFormat('es-CL', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function toDateOnly(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function addDaysToDateOnly(value: string, amount: number): string {
  return toDateOnly(addDays(parseDateOnly(value), amount));
}

export function daysFromToday(value: string, today = getTodayInSantiago()): number {
  return differenceInCalendarDays(parseDateOnly(value), parseDateOnly(today));
}

export function startOfWeekOnMonday(value: string | Date): Date {
  const date = value instanceof Date ? value : parseDateOnly(value);
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function getWeekdayLabels(): string[] {
  return ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
