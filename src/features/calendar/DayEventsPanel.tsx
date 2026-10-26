import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { CalendarDays, ChevronRight, ClipboardCheck, ListTodo, Plus } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { SubjectLabel } from '@/components/common/SubjectLabel';
import type { CalendarEvent, Subject } from '@/types';
import { isCalendarEventUpcoming } from '@/utils/academic';
import { capitalize, formatLongDate, getTodayInSantiago, toDateOnly } from '@/utils/dates';
import { getEventColors } from '@/features/calendar/calendarUtils';

interface DayEventsPanelProps {
  selectedDate: Date;
  events: CalendarEvent[];
  subjects: Subject[];
  onOpenEvent: (event: CalendarEvent) => void;
  onCreateTask: () => void;
  onCreateEvaluation: () => void;
}

export function DayEventsPanel({
  selectedDate,
  events,
  subjects,
  onOpenEvent,
  onCreateTask,
  onCreateEvaluation,
}: DayEventsPanelProps) {
  const today = getTodayInSantiago();
  const selectedDateKey = toDateOnly(selectedDate);
  const isToday = selectedDateKey === today;

  return (
    <Card sx={{ height: 'fit-content' }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
          <CalendarDays size={18} color="#2563EB" />
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>
            {isToday ? 'Hoy' : 'Día seleccionado'}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {capitalize(formatLongDate(selectedDate))}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {events.length === 0 ? (
          <EmptyState
            compact
            icon={<CalendarDays size={22} />}
            title="Sin actividades"
            description="No hay tareas ni evaluaciones para este día."
          />
        ) : (
          <Stack spacing={1}>
            {events.map((event) => {
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
                    p: 1.25,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: colors.border,
                    bgcolor: colors.background,
                    opacity: event.completed ? 0.65 : 1,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box sx={{ color: colors.color, mt: 0.15 }}>
                      <Icon size={16} />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography
                          variant="caption"
                          sx={{ color: colors.color, fontWeight: 700 }}
                        >
                          {event.kind === 'task' ? 'Tarea' : 'Evaluación'}
                        </Typography>
                        {upcoming && (
                          <Chip
                            label="Próxima"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ height: 18, fontSize: '0.62rem' }}
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.3,
                          textDecoration: event.completed ? 'line-through' : 'none',
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <SubjectLabel subject={subject} />
                      </Box>
                    </Box>
                    <ChevronRight size={16} color="#94A3B8" style={{ marginTop: 2 }} />
                  </Stack>
                </ButtonBase>
              );
            })}
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Plus size={16} />}
            onClick={onCreateTask}
          >
            Nueva tarea en esta fecha
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Plus size={16} />}
            onClick={onCreateEvaluation}
          >
            Nueva evaluación en esta fecha
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
