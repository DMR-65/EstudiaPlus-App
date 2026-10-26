import { useMemo } from 'react';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock3 } from 'lucide-react';
import type { CalendarEvent } from '@/types';
import { isCalendarEventUpcoming } from '@/utils/academic';
import { getTodayInSantiago, toDateOnly } from '@/utils/dates';
import {
  getEventColors,
  getWeekDays,
  groupEventsByDate,
} from '@/features/calendar/calendarUtils';

interface WeekViewProps {
  date: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onOpenEvent: (event: CalendarEvent) => void;
}

export function WeekView({
  date,
  selectedDate,
  events,
  onSelectDate,
  onOpenEvent,
}: WeekViewProps) {
  const today = getTodayInSantiago();
  const days = useMemo(() => getWeekDays(date), [date]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(150px, 1fr))',
          gap: 1.25,
          minWidth: 780,
          p: 1,
        }}
      >
        {days.map((day) => {
          const dateKey = toDateOnly(day);
          const dayEvents = eventsByDate.get(dateKey) ?? [];
          const isToday = dateKey === today;
          const isSelected = isSameDay(day, selectedDate);

          return (
            <Box
              key={dateKey}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDate(day)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectDate(day);
                }
              }}
              aria-pressed={isSelected}
              sx={{
                minHeight: 330,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? '#EFF6FF' : 'background.paper',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:focus-visible': {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: 2,
                },
              }}
            >
              <Box
                sx={{
                  px: 1.25,
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isToday ? 'primary.main' : 'transparent',
                  color: isToday ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}
                >
                  {format(day, 'EEE', { locale: es })}
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                  {format(day, 'd')}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                  {format(day, 'MMM', { locale: es })}
                </Typography>
              </Box>

              <Stack spacing={0.75} sx={{ p: 1 }}>
                {dayEvents.length === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ textAlign: 'center', mt: 3, display: 'block' }}
                  >
                    Sin actividades
                  </Typography>
                ) : (
                  dayEvents.map((event) => {
                    const colors = getEventColors(event.kind);
                    const upcoming = isCalendarEventUpcoming(event, today);

                    return (
                      <ButtonBase
                        key={`${event.kind}-${event.id}`}
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          onOpenEvent(event);
                        }}
                        sx={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          p: 0.9,
                          borderRadius: 1.5,
                          bgcolor: colors.background,
                          border: '1px solid',
                          borderColor: colors.border,
                          opacity: event.completed ? 0.58 : 1,
                        }}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: colors.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="caption"
                            noWrap
                            sx={{ color: colors.color, fontWeight: 700, flexGrow: 1 }}
                          >
                            {event.kind === 'task' ? 'Tarea' : 'Evaluación'}
                          </Typography>
                          {upcoming && <Clock3 size={11} color="#D97706" />}
                        </Stack>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.4,
                            fontWeight: 600,
                            lineHeight: 1.3,
                            color: 'text.primary',
                          }}
                        >
                          {event.title}
                        </Typography>
                      </ButtonBase>
                    );
                  })
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
