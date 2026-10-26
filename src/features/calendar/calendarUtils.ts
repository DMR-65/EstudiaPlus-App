import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';
import type { CalendarEvent } from '@/types';
import { capitalize } from '@/utils/dates';

export type CalendarView = 'mes' | 'semana' | 'agenda';
export type EventKindFilter = 'all' | 'task' | 'evaluation';

export function getMonthDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const dayEvents = grouped.get(event.date) ?? [];
    dayEvents.push(event);
    grouped.set(event.date, dayEvents);
  }

  return grouped;
}

export function formatMonthTitle(date: Date): string {
  return capitalize(format(date, 'MMMM yyyy', { locale: es }));
}

export function formatWeekTitle(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`;
}

export function getEventColors(kind: CalendarEvent['kind']): {
  color: string;
  background: string;
  border: string;
} {
  if (kind === 'task') {
    return {
      color: '#1D4ED8',
      background: '#EFF6FF',
      border: '#BFDBFE',
    };
  }

  return {
    color: '#6D28D9',
    background: '#F5F3FF',
    border: '#DDD6FE',
  };
}
