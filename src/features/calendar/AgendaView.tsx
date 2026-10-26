import { useMemo } from 'react';
import {
  Box,
  ButtonBase,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { format, isToday as isDateToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays, ChevronRight, ClipboardCheck, ListTodo } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { SubjectLabel } from '@/components/common/SubjectLabel';
import type { CalendarEvent, Subject } from '@/types';
import { isCalendarEventUpcoming } from '@/utils/academic';
import { capitalize, getTodayInSantiago } from '@/utils/dates';
import {
  getEventColors,
  groupEventsByDate,
} from '@/features/calendar/calendarUtils';

interface AgendaViewProps {
  events: CalendarEvent[];
  subjects: Subject[];
  onOpenEvent: (event: CalendarEvent) => void;
}

export function AgendaView({ events, subjects, onOpenEvent }: AgendaViewProps) {
  const today = getTodayInSantiago();
  const groupedEvents = useMemo(() => {
    const grouped = groupEventsByDate(events);
    return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays size={26} />}
        title="No hay actividades en la agenda"
        description="Crea una tarea o evaluación, o cambia los filtros del calendario."
      />
    );
  }

  return (
    <Stack spacing={2.5} sx={{ p: { xs: 1, sm: 1.5 } }}>
      {groupedEvents.map(([date, dayEvents]) => {
        const dateObject = parseISO(date);
        const isPast = date < today;

        return (
          <Box key={date}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 800, color: isDateToday(dateObject) ? 'primary.main' : 'text.primary' }}
              >
                {isDateToday(dateObject)
                  ? 'Hoy'
                  : capitalize(format(dateObject, "EEEE d 'de' MMMM", { locale: es }))}
              </Typography>
              <Chip
                label={`${dayEvents.length} ${dayEvents.length === 1 ? 'actividad' : 'actividades'}`}
                size="small"
                variant="outlined"
              />
              {isPast && (
                <Typography variant="caption" color="text.secondary">
                  Fecha pasada
                </Typography>
              )}
            </Stack>

            <Stack spacing={1}>
              {dayEvents.map((event) => {
                const subject = subjects.find((item) => item.id === event.subjectId);
                const colors = getEventColors(event.kind);
                const upcoming = isCalendarEventUpcoming(event, today);
                const Icon = event.kind === 'task' ? ListTodo : ClipboardCheck;

                return (
                  <ButtonBase
                    key={`${event.kind}-${event.id}`}
                    onClick={() => onOpenEvent(event)}
                    sx={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      p: 1.5,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: colors.border,
                      bgcolor: colors.background,
                      opacity: event.completed || isPast ? 0.72 : 1,
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      spacing={1}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            color: colors.color,
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={19} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={0.75} alignItems="center">
                            <Typography
                              variant="caption"
                              sx={{ color: colors.color, fontWeight: 700 }}
                            >
                              {event.kind === 'task' ? 'Tarea' : 'Evaluación'}
                            </Typography>
                            <SubjectLabel subject={subject} />
                          </Stack>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: 700,
                              textDecoration: event.completed ? 'line-through' : 'none',
                            }}
                          >
                            {event.title}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center" flexShrink={0}>
                        {upcoming && (
                          <Chip label="Próxima" size="small" color="warning" variant="outlined" />
                        )}
                        {event.completed && (
                          <Chip label="Completada" size="small" color="success" variant="outlined" />
                        )}
                        <ChevronRight size={18} color="#64748B" />
                      </Stack>
                    </Stack>
                  </ButtonBase>
                );
              })}
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}
