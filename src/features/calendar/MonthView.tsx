import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { isSameDay, isSameMonth, format } from 'date-fns';
import type { CalendarEvent } from '@/types';
import { isCalendarEventUpcoming } from '@/utils/academic';
import { formatLongDate, getTodayInSantiago, getWeekdayLabels, toDateOnly } from '@/utils/dates';
import { getEventColors, getMonthDays, groupEventsByDate } from '@/features/calendar/calendarUtils';

interface MonthViewProps {
  month: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onOpenEvent: (event: CalendarEvent) => void;
}

export function MonthView({
  month,
  selectedDate,
  events,
  onSelectDate,
  onOpenEvent,
}: MonthViewProps) {
  const today = getTodayInSantiago();
  const days = useMemo(() => getMonthDays(month), [month]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);
  const weekdays = getWeekdayLabels();

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: { xs: 720, md: 0 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {weekdays.map((weekday) => (
            <Typography
              key={weekday}
              variant="caption"
              color="text.secondary"
              sx={{
                py: 1.25,
                textAlign: 'center',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {weekday}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            borderLeft: '1px solid',
            borderColor: 'divider',
          }}
        >
          {days.map((day) => {
            const dateKey = toDateOnly(day);
            const dayEvents = eventsByDate.get(dateKey) ?? [];
            const isCurrentMonth = isSameMonth(day, month);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = dateKey === today;
            const visibleEvents = dayEvents.slice(0, 2);

            return (
              <Box
                key={dateKey}
                role="button"
                tabIndex={0}
                aria-label={`${formatLongDate(day)}, ${dayEvents.length} eventos`}
                aria-pressed={isSelected}
                onClick={() => onSelectDate(day)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectDate(day);
                  }
                }}
                sx={{
                  minHeight: { xs: 102, md: 118 },
                  p: 0.75,
                  borderRight: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  bgcolor: isSelected
                    ? '#EFF6FF'
                    : !isCurrentMonth
                      ? 'action.hover'
                      : 'background.paper',
                  outline: isSelected ? '2px solid' : 'none',
                  outlineColor: 'primary.main',
                  outlineOffset: -2,
                  transition: 'background-color 0.12s ease',
                  opacity: isCurrentMonth ? 1 : 0.58,
                  '&:hover': {
                    bgcolor: isSelected ? '#DBEAFE' : 'action.hover',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: -2,
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: isToday ? 'primary.main' : 'transparent',
                      color: isToday ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {format(day, 'd')}
                    </Typography>
                  </Box>
                  {dayEvents.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {dayEvents.length}
                    </Typography>
                  )}
                </Stack>

                <Stack spacing={0.4} sx={{ mt: 0.5 }}>
                  {visibleEvents.map((event) => {
                    const colors = getEventColors(event.kind);
                    const upcoming = isCalendarEventUpcoming(event, today);

                    return (
                      <Box
                        key={`${event.kind}-${event.id}`}
                        component="button"
                        type="button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          onOpenEvent(event);
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          width: '100%',
                          border: '1px solid',
                          borderColor: colors.border,
                          borderRadius: 1,
                          bgcolor: colors.background,
                          color: colors.color,
                          px: 0.55,
                          py: 0.25,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          textAlign: 'left',
                          opacity: event.completed ? 0.55 : 1,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: colors.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{ fontSize: '0.66rem', fontWeight: 600, flexGrow: 1, minWidth: 0 }}
                        >
                          {event.title}
                        </Typography>
                        {upcoming && (
                          <Box
                            component="span"
                            title="Actividad próxima"
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              bgcolor: 'warning.main',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <Typography variant="caption" color="text.secondary" sx={{ pl: 0.5 }}>
                      +{dayEvents.length - 2} más
                    </Typography>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
