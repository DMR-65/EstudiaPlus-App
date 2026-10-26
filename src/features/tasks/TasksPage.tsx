import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AlertTriangle, Clock3, ListTodo, Plus, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { useFeedback } from '@/components/feedback/FeedbackProvider';
import { useAppData } from '@/features/app-data/AppDataContext';
import { TaskCard } from '@/features/tasks/TaskCard';
import { TaskFormDialog } from '@/features/tasks/TaskFormDialog';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '@/types';
import type { Task, TaskDraft, TaskPriority, TaskStatus } from '@/types';
import {
  countOverdueTasks,
  isTaskDueSoon,
} from '@/utils/academic';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/utils/constants';
import { getTodayInSantiago } from '@/utils/dates';

type SortOrder = 'due-asc' | 'due-desc';

function taskToDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    subjectId: task.subjectId,
    assignedDate: task.assignedDate,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
  };
}

export function TasksPage() {
  const { data, createTask, updateTask, deleteTask } = useAppData();
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('due-asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const { tasks, subjects } = data;
  const today = getTodayInSantiago();

  useEffect(() => {
    const subjectParam = searchParams.get('asignatura');
    const createRequested = searchParams.get('nueva') === '1';
    const editId = searchParams.get('editar');
    const dateParam = searchParams.get('fecha');

    let shouldClear = false;

    if (subjectParam && subjects.some((subject) => subject.id === subjectParam)) {
      setSubjectFilter(subjectParam);
      shouldClear = true;
    }

    if (createRequested) {
      setEditingTask(null);
      setDefaultDate(dateParam ?? undefined);
      setDialogOpen(true);
      shouldClear = true;
    } else if (editId) {
      const task = tasks.find((item) => item.id === editId);
      if (task) {
        setEditingTask(task);
        setDefaultDate(undefined);
        setDialogOpen(true);
        shouldClear = true;
      }
    }

    if (shouldClear) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('asignatura');
      nextParams.delete('nueva');
      nextParams.delete('editar');
      nextParams.delete('fecha');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams, subjects, tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (normalizedSearch && !task.title.toLowerCase().includes(normalizedSearch)) {
          return false;
        }
        if (subjectFilter !== 'all' && task.subjectId !== subjectFilter) {
          return false;
        }
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
          return false;
        }
        if (statusFilter !== 'all' && task.status !== statusFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const comparison = a.dueDate.localeCompare(b.dueDate);
        return sortOrder === 'due-asc' ? comparison : -comparison;
      });
  }, [tasks, search, subjectFilter, priorityFilter, statusFilter, sortOrder]);

  const overdueCount = countOverdueTasks(tasks, today);
  const dueSoonCount = tasks.filter((task) => isTaskDueSoon(task, today)).length;

  const hasFilters =
    search.trim().length > 0 ||
    subjectFilter !== 'all' ||
    priorityFilter !== 'all' ||
    statusFilter !== 'all';

  const openCreate = () => {
    if (subjects.length === 0) {
      notify('Primero crea una asignatura para registrar tareas.', 'warning');
      navigate('/asignaturas?nueva=1');
      return;
    }

    setEditingTask(null);
    setDefaultDate(undefined);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
    setDefaultDate(undefined);
  };

  const handleSave = (draft: TaskDraft): boolean => {
    const success = editingTask
      ? updateTask(editingTask.id, draft)
      : createTask(draft);

    if (success) {
      notify(editingTask ? 'Tarea actualizada correctamente.' : 'Tarea creada correctamente.');
    }

    return success;
  };

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    if (task.status === status) {
      return;
    }

    const success = updateTask(task.id, { ...taskToDraft(task), status });
    if (success) {
      if (status === 'completada') {
        notify('Tarea marcada como completada.');
      } else {
        notify(`Estado actualizado a “${TASK_STATUS_LABELS[status]}”.`);
      }
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const success = deleteTask(deleteTarget.id);
    if (success) {
      notify('Tarea eliminada correctamente.');
      setDeleteTarget(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSubjectFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  if (subjects.length === 0) {
    return (
      <Box>
        <PageHeader
          title="Tareas"
          subtitle="Gestiona tus trabajos escolares y sus fechas de entrega."
        />
        <EmptyState
          icon={<ListTodo size={26} />}
          title="Primero crea una asignatura"
          description="Las tareas deben estar asociadas a una asignatura. Crea una para comenzar."
          action={
            <Button variant="contained" onClick={() => navigate('/asignaturas?nueva=1')}>
              Ir a asignaturas
            </Button>
          }
        />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Tareas"
        subtitle="Gestiona tus trabajos escolares, prioridades y fechas de entrega."
        actions={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={openCreate}>
            Nueva tarea
          </Button>
        }
      />

      {(overdueCount > 0 || dueSoonCount > 0) && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {overdueCount > 0 && (
            <Chip
              icon={<AlertTriangle size={15} />}
              label={`${overdueCount} ${overdueCount === 1 ? 'tarea vencida' : 'tareas vencidas'}`}
              color="error"
              variant="outlined"
            />
          )}
          {dueSoonCount > 0 && (
            <Chip
              icon={<Clock3 size={15} />}
              label={`${dueSoonCount} por vencer en los próximos 3 días`}
              color="warning"
              variant="outlined"
            />
          )}
        </Stack>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'minmax(220px, 1.5fr) repeat(3, minmax(150px, 1fr)) minmax(170px, 1fr)',
          },
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por título"
          aria-label="Buscar tareas por título"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={17} color="#64748B" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
          label="Asignatura"
          aria-label="Filtrar por asignatura"
        >
          <MenuItem value="all">Todas</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value as TaskPriority | 'all')
          }
          label="Prioridad"
          aria-label="Filtrar por prioridad"
        >
          <MenuItem value="all">Todas</MenuItem>
          {TASK_PRIORITIES.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {TASK_PRIORITY_LABELS[priority]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as TaskStatus | 'all')}
          label="Estado"
          aria-label="Filtrar por estado"
        >
          <MenuItem value="all">Todos</MenuItem>
          {TASK_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          label="Ordenar por entrega"
          aria-label="Ordenar tareas por fecha de entrega"
        >
          <MenuItem value="due-asc">Más próxima primero</MenuItem>
          <MenuItem value="due-desc">Más lejana primero</MenuItem>
        </TextField>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          {filteredTasks.length} de {tasks.length} tareas
        </Typography>
        {hasFilters && (
          <Button size="small" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        )}
      </Stack>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<Search size={26} />}
          title={tasks.length === 0 ? 'Aún no tienes tareas' : 'No encontramos tareas'}
          description={
            tasks.length === 0
              ? 'Registra tu primera tarea para organizar tu semana.'
              : 'Prueba cambiando la búsqueda o los filtros seleccionados.'
          }
          action={
            tasks.length === 0 ? (
              <Button variant="contained" startIcon={<Plus size={17} />} onClick={openCreate}>
                Registrar tarea
              </Button>
            ) : (
              <Button variant="outlined" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2.5,
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              subject={subjects.find((subject) => subject.id === task.subjectId)}
              today={today}
              onEdit={() => {
                setEditingTask(task);
                setDefaultDate(undefined);
                setDialogOpen(true);
              }}
              onDelete={() => setDeleteTarget(task)}
              onStatusChange={(status) => handleStatusChange(task, status)}
            />
          ))}
        </Box>
      )}

      <TaskFormDialog
        open={dialogOpen}
        task={editingTask}
        subjects={subjects}
        defaultDate={defaultDate}
        onClose={closeDialog}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar tarea"
        description={
          deleteTarget
            ? `¿Seguro que quieres eliminar “${deleteTarget.title}”? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
