import { useEffect } from 'react';
import {
  Alert,
  Box,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FormDialog } from '@/components/common/FormDialog';
import { evaluationSchema } from '@/features/evaluations/evaluationSchema';
import type { EvaluationFormValues } from '@/features/evaluations/evaluationSchema';
import { EVALUATION_STATUSES, EVALUATION_TYPES } from '@/types';
import type { Evaluation, EvaluationDraft, Subject } from '@/types';
import {
  EVALUATION_STATUS_LABELS,
  EVALUATION_TYPE_LABELS,
} from '@/utils/constants';
import { addDaysToDateOnly, getTodayInSantiago } from '@/utils/dates';

interface EvaluationFormDialogProps {
  open: boolean;
  evaluation?: Evaluation | null;
  subjects: Subject[];
  defaultDate?: string;
  onClose: () => void;
  onSubmit: (draft: EvaluationDraft) => boolean;
}

function buildDefaultValues(
  subjects: Subject[],
  defaultDate?: string,
): EvaluationFormValues {
  const today = getTodayInSantiago();
  return {
    title: '',
    description: '',
    subjectId: subjects.find((subject) => subject.isActive)?.id ?? '',
    type: 'prueba',
    date: defaultDate ?? addDaysToDateOnly(today, 7),
    weighting: '',
    maxScore: '',
    grade: '',
    status: 'programada',
  };
}

function optionalNumber(value: string): number | undefined {
  return value.trim() === '' ? undefined : Number(value);
}

export function EvaluationFormDialog({
  open,
  evaluation,
  subjects,
  defaultDate,
  onClose,
  onSubmit,
}: EvaluationFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: buildDefaultValues(subjects, defaultDate),
    mode: 'onTouched',
  });

  const status = watch('status');

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      evaluation
        ? {
            title: evaluation.title,
            description: evaluation.description,
            subjectId: evaluation.subjectId,
            type: evaluation.type,
            date: evaluation.date,
            weighting:
              evaluation.weighting === undefined ? '' : String(evaluation.weighting),
            maxScore:
              evaluation.maxScore === undefined ? '' : String(evaluation.maxScore),
            grade: evaluation.grade === undefined ? '' : String(evaluation.grade),
            status: evaluation.status,
          }
        : buildDefaultValues(subjects, defaultDate),
    );
  }, [open, evaluation, subjects, defaultDate, reset]);

  const submit = (values: EvaluationFormValues) => {
    const success = onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      subjectId: values.subjectId,
      type: values.type,
      date: values.date,
      weighting: optionalNumber(values.weighting),
      maxScore: optionalNumber(values.maxScore),
      grade: values.status === 'programada' ? undefined : optionalNumber(values.grade),
      status: values.status,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <FormDialog
      open={open}
      title={evaluation ? 'Editar evaluación' : 'Nueva evaluación'}
      subtitle="Registra pruebas, controles, trabajos o exposiciones."
      submitLabel={evaluation ? 'Guardar cambios' : 'Crear evaluación'}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
    >
      {subjects.length === 0 ? (
        <Alert severity="warning">
          Primero debes crear una asignatura para poder registrar evaluaciones.
        </Alert>
      ) : (
        <Stack spacing={2.25}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Título de la evaluación"
                placeholder="Ej. Prueba de tablas de multiplicar"
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
                placeholder="Contenidos y formato de la evaluación"
                multiline
                minRows={2.5}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                fullWidth
              />
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
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Tipo"
                  error={Boolean(errors.type)}
                  helperText={errors.type?.message}
                  fullWidth
                >
                  {EVALUATION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {EVALUATION_TYPE_LABELS[type]}
                    </MenuItem>
                  ))}
                </TextField>
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
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Fecha"
                  error={Boolean(errors.date)}
                  helperText={errors.date?.message}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
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
                  onChange={(event) => {
                    field.onChange(event);
                    if (event.target.value === 'programada') {
                      setValue('grade', '', { shouldValidate: true });
                    }
                  }}
                >
                  {EVALUATION_STATUSES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {EVALUATION_STATUS_LABELS[value]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 2,
            }}
          >
            <Controller
              name="weighting"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ponderación (%)"
                  placeholder="Opcional"
                  type="number"
                  error={Boolean(errors.weighting)}
                  helperText={errors.weighting?.message ?? 'Entre 0 y 100'}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
                />
              )}
            />
            <Controller
              name="maxScore"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Puntaje máximo"
                  placeholder="Opcional"
                  type="number"
                  error={Boolean(errors.maxScore)}
                  helperText={errors.maxScore?.message ?? 'Puntos totales'}
                  fullWidth
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                />
              )}
            />
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Calificación"
                  placeholder="Opcional"
                  type="number"
                  disabled={status === 'programada'}
                  error={Boolean(errors.grade)}
                  helperText={
                    status === 'programada'
                      ? 'Se habilita al realizar la evaluación'
                      : (errors.grade?.message ?? 'Escala 1,0 a 7,0')
                  }
                  fullWidth
                  slotProps={{ htmlInput: { min: 1, max: 7, step: 0.1 } }}
                />
              )}
            />
          </Box>

          <Alert severity="info" sx={{ py: 0.5 }}>
            Las evaluaciones programadas no deben tener calificación. Registra la nota
            cuando la evaluación ya se haya realizado.
          </Alert>
        </Stack>
      )}
    </FormDialog>
  );
}
