import { useEffect } from 'react';
import { Alert, Box, MenuItem, Stack, TextField } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FormDialog } from '@/components/common/FormDialog';
import { taskSchema } from '@/features/tasks/taskSchema';
import type { TaskFormValues } from '@/features/tasks/taskSchema';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types';
import type { Subject, Task, TaskDraft } from '@/types';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/utils/constants';
import { addDaysToDateOnly, getTodayInSantiago } from '@/utils/dates';

interface TaskFormDialogProps {
  open: boolean;
  task?: Task | null;
  subjects: Subject[];
  defaultDate?: string;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => boolean;
}

function buildDefaultValues(subjects: Subject[], defaultDate?: string): TaskFormValues {
  const today = getTodayInSantiago();
  return {
    title: '',
    description: '',
    subjectId: subjects.find((subject) => subject.isActive)?.id ?? '',
    assignedDate: today,
    dueDate: defaultDate ?? addDaysToDateOnly(today, 3),
    priority: 'media',
    status: 'pendiente',
  };
}

export function TaskFormDialog({
  open,
  task,
  subjects,
  defaultDate,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: buildDefaultValues(subjects, defaultDate),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      task
        ? {
            title: task.title,
            description: task.description,
            subjectId: task.subjectId,
            assignedDate: task.assignedDate,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
          }
        : buildDefaultValues(subjects, defaultDate),
    );
  }, [open, task, subjects, defaultDate, reset]);

  const submit = (values: TaskFormValues) => {
    const success = onSubmit(values);
    if (success) {
      onClose();
    }
  };

  return (
    <FormDialog
      open={open}
      title={task ? 'Editar tarea' : 'Nueva tarea'}
      subtitle="Registra el trabajo, su asignatura y las fechas importantes."
      submitLabel={task ? 'Guardar cambios' : 'Crear tarea'}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
    >
      {subjects.length === 0 ? (
        <Alert severity="warning">
          Primero debes crear una asignatura para poder registrar tareas.
        </Alert>
      ) : (
        <Stack spacing={2.25}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Título de la tarea"
                placeholder="Ej. Resolver ejercicios de multiplicación"
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
                fullWidth
                autoFocus
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                placeholder="Detalla qué debes hacer y qué materiales necesitas"
                multiline
                minRows={2.5}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Asignatura"
                error={Boolean(errors.subjectId)}
                helperText={errors.subjectId?.message}
                fullWidth
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                    {!subject.isActive ? ' (inactiva)' : ''}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <Controller
              name="assignedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Fecha de asignación"
                  error={Boolean(errors.assignedDate)}
                  helperText={errors.assignedDate?.message}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Fecha de entrega"
                  error={Boolean(errors.dueDate)}
                  helperText={errors.dueDate?.message}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Prioridad"
                  error={Boolean(errors.priority)}
                  helperText={errors.priority?.message}
                  fullWidth
                >
                  {TASK_PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {TASK_PRIORITY_LABELS[priority]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Estado"
                  error={Boolean(errors.status)}
                  helperText={errors.status?.message}
                  fullWidth
                >
                  {TASK_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {TASK_STATUS_LABELS[status]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
        </Stack>
      )}
    </FormDialog>
  );
}
