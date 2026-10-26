import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  List,
  ListTodo,
  Plus,
} from 'lucide-react';
import { addMonths, addWeeks, startOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { useAppData } from '@/features/app-data/AppDataContext';
import { AgendaView } from '@/features/calendar/AgendaView';
import { DayEventsPanel } from '@/features/calendar/DayEventsPanel';
import { EventDetailDialog } from '@/features/calendar/EventDetailDialog';
import { MonthView } from '@/features/calendar/MonthView';
import { WeekView } from '@/features/calendar/WeekView';
import {
  formatMonthTitle,
  formatWeekTitle,
} from '@/features/calendar/calendarUtils';
import type {
  CalendarView,
  EventKindFilter,
} from '@/features/calendar/calendarUtils';
import type { CalendarEvent } from '@/types';
import { buildCalendarEvents } from '@/utils/academic';
import { getTodayInSantiago, parseDateOnly, toDateOnly } from '@/utils/dates';

export function CalendarPage() {
  const navigate = useNavigate();
  const { data } = useAppData();
  const todayKey = getTodayInSantiago();
  const todayDate = useMemo(() => parseDateOnly(todayKey), [todayKey]);

  const [view, setView] = useState<CalendarView>('mes');
  const [currentDate, setCurrentDate] = useState<Date>(todayDate);
  const [selectedDate, setSelectedDate] = useState<Date>(todayDate);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [kindFilter, setKindFilter] = useState<EventKindFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const allEvents = useMemo(
    () => buildCalendarEvents(data.tasks, data.evaluations),
    [data.tasks, data.evaluations],
  );

  const filteredEvents = useMemo(
    () =>
      allEvents.filter((event) => {
        if (subjectFilter !== 'all' && event.subjectId !== subjectFilter) {
          return false;
        }
        if (kindFilter !== 'all' && event.kind !== kindFilter) {
          return false;
        }
        return true;
      }),
    [allEvents, subjectFilter, kindFilter],
  );

  const selectedDayEvents = filteredEvents.filter(
    (event) => event.date === toDateOnly(selectedDate),
  );

  const periodTitle =
    view === 'mes'
      ? formatMonthTitle(currentDate)
      : view === 'semana'
        ? formatWeekTitle(currentDate)
        : 'Agenda académica';

  const navigatePeriod = (direction: -1 | 1) => {
    if (view === 'semana') {
      const nextDate = addWeeks(currentDate, direction);
      setCurrentDate(nextDate);
      setSelectedDate(nextDate);
      return;
    }

    const nextDate = addMonths(currentDate, direction);
    setCurrentDate(nextDate);
    setSelectedDate(startOfMonth(nextDate));
  };

  const goToToday = () => {
    setCurrentDate(todayDate);
    setSelectedDate(todayDate);
  };

  const createTask = () => {
    navigate(`/tareas?nueva=1&fecha=${toDateOnly(selectedDate)}`);
  };

  const createEvaluation = () => {
    navigate(`/evaluaciones?nueva=1&fecha=${toDateOnly(selectedDate)}`);
  };

  const selectedTask =
    selectedEvent?.kind === 'task'
      ? data.tasks.find((task) => task.id === selectedEvent.id)
      : undefined;
  const selectedEvaluation =
    selectedEvent?.kind === 'evaluation'
      ? data.evaluations.find((evaluation) => evaluation.id === selectedEvent.id)
      : undefined;
  const selectedSubject = data.subjects.find(
    (subject) => subject.id === selectedEvent?.subjectId,
  );

  const editSelectedEvent = () => {
    if (!selectedEvent) {
      return;
    }

    const path =
      selectedEvent.kind === 'task'
        ? `/tareas?editar=${selectedEvent.id}`
        : `/evaluaciones?editar=${selectedEvent.id}`;
    setSelectedEvent(null);
    navigate(path);
  };

  return (
    <Box>
      <PageHeader
        title="Calendario académico"
        subtitle="Visualiza tus tareas y evaluaciones en una misma línea de tiempo."
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<ListTodo size={17} />}
              onClick={createTask}
            >
              Nueva tarea
            </Button>
            <Button
              variant="contained"
              startIcon={<ClipboardCheck size={17} />}
              onClick={createEvaluation}
            >
              Nueva evaluación
            </Button>
          </>
        }
      />

      <Card sx={{ mb: 2.5 }}>
        <Box sx={{ p: { xs: 1.5, md: 2 } }}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', lg: 'center' }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} flexWrap="wrap" useFlexGap>
              {view !== 'agenda' && (
                <>
                  <Tooltip title="Período anterior">
                    <IconButton
                      onClick={() => navigatePeriod(-1)}
                      aria-label="Ir al período anterior"
                      size="small"
                    >
                      <ChevronLeft size={20} />
                    </IconButton>
                  </Tooltip>
                  <Typography
                    variant="h6"
                    sx={{ minWidth: { sm: 190 }, textAlign: 'center', fontSize: '1.05rem' }}
                  >
                    {periodTitle}
                  </Typography>
                  <Tooltip title="Período siguiente">
                    <IconButton
                      onClick={() => navigatePeriod(1)}
                      aria-label="Ir al período siguiente"
                      size="small"
                    >
                      <ChevronRight size={20} />
                    </IconButton>
                  </Tooltip>
                  <Button size="small" onClick={goToToday} sx={{ ml: 0.5 }}>
                    Hoy
                  </Button>
                </>
              )}
              {view === 'agenda' && (
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1.05rem' }}>
                    {periodTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Todas las actividades ordenadas por fecha
                  </Typography>
                </Box>
              )}
            </Stack>

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_event, nextView: CalendarView | null) => {
                if (nextView) {
                  setView(nextView);
                }
              }}
              size="small"
              aria-label="Vista del calendario"
            >
              <ToggleButton value="mes" aria-label="Vista mensual">
                <CalendarDays size={16} style={{ marginRight: 6 }} />
                Mes
              </ToggleButton>
              <ToggleButton value="semana" aria-label="Vista semanal">
                <CalendarRange size={16} style={{ marginRight: 6 }} />
                Semana
              </ToggleButton>
              <ToggleButton value="agenda" aria-label="Vista de agenda">
                <List size={16} style={{ marginRight: 6 }} />
                Agenda
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Divider sx={{ my: 1.75 }} />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', md: 'center' }}
            spacing={1.5}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                label="Asignatura"
                aria-label="Filtrar calendario por asignatura"
                sx={{ minWidth: { sm: 220 } }}
              >
                <MenuItem value="all">Todas las asignaturas</MenuItem>
                {data.subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                value={kindFilter}
                onChange={(event) =>
                  setKindFilter(event.target.value as EventKindFilter)
                }
                label="Tipo de evento"
                aria-label="Filtrar calendario por tipo de evento"
                sx={{ minWidth: { sm: 200 } }}
              >
                <MenuItem value="all">Tareas y evaluaciones</MenuItem>
                <MenuItem value="task">Solo tareas</MenuItem>
                <MenuItem value="evaluation">Solo evaluaciones</MenuItem>
              </TextField>
            </Stack>

            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
              <Chip
                label="Tareas"
                size="small"
                variant="outlined"
                icon={
                  <Box
                    component="span"
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2563EB' }}
                  />
                }
              />
              <Chip
                label="Evaluaciones"
                size="small"
                variant="outlined"
                icon={
                  <Box
                    component="span"
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#7C3AED' }}
                  />
                }
              />
              <Chip
                label="Próximas"
                size="small"
                variant="outlined"
                icon={
                  <Box
                    component="span"
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B' }}
                  />
                }
              />
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ p: { xs: 1.5, md: 2 } }}>
          {view === 'mes' && (
            <MonthView
              month={currentDate}
              selectedDate={selectedDate}
              events={filteredEvents}
              onSelectDate={setSelectedDate}
              onOpenEvent={setSelectedEvent}
            />
          )}
          {view === 'semana' && (
            <WeekView
              date={currentDate}
              selectedDate={selectedDate}
              events={filteredEvents}
              onSelectDate={setSelectedDate}
              onOpenEvent={setSelectedEvent}
            />
          )}
          {view === 'agenda' && (
            <AgendaView
              events={filteredEvents}
              subjects={data.subjects}
              onOpenEvent={setSelectedEvent}
            />
          )}
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: view === 'agenda' ? '1fr' : 'minmax(0, 1fr) 330px',
          },
          gap: 2.5,
        }}
      >
        {view !== 'agenda' && (
          <DayEventsPanel
            selectedDate={selectedDate}
            events={selectedDayEvents}
            subjects={data.subjects}
            onOpenEvent={setSelectedEvent}
            onCreateTask={createTask}
            onCreateEvaluation={createEvaluation}
          />
        )}
        <Card
          sx={{
            p: 2.5,
            display: view === 'agenda' ? 'none' : 'block',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)',
            borderColor: '#DBEAFE',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Plus size={18} color="#2563EB" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Crea desde el calendario
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona un día y registra una tarea o evaluación con esa fecha
            preseleccionada.
          </Typography>
          <Button variant="contained" fullWidth onClick={createTask} sx={{ mb: 1 }}>
            Nueva tarea
          </Button>
          <Button variant="outlined" fullWidth onClick={createEvaluation}>
            Nueva evaluación
          </Button>
        </Card>
      </Box>

      <EventDetailDialog
        event={selectedEvent}
        task={selectedTask}
        evaluation={selectedEvaluation}
        subject={selectedSubject}
        onClose={() => setSelectedEvent(null)}
        onEdit={editSelectedEvent}
      />
    </Box>
  );
}
