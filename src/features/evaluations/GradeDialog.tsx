import { useEffect } from 'react';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FormDialog } from '@/components/common/FormDialog';
import { gradeSchema } from '@/features/evaluations/evaluationSchema';
import type { GradeFormValues } from '@/features/evaluations/evaluationSchema';
import type { Evaluation } from '@/types';
import { formatGrade } from '@/utils/academic';

interface GradeDialogProps {
  open: boolean;
  evaluation: Evaluation | null;
  onClose: () => void;
  onSubmit: (grade: number) => boolean;
}

export function GradeDialog({ open, evaluation, onClose, onSubmit }: GradeDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: { grade: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      grade: evaluation?.grade === undefined ? '' : String(evaluation.grade),
    });
  }, [open, evaluation, reset]);

  const submit = (values: GradeFormValues) => {
    const success = onSubmit(Number(values.grade));
    if (success) {
      onClose();
    }
  };

  return (
    <FormDialog
      open={open}
      title="Registrar calificación"
      subtitle={evaluation?.title}
      submitLabel="Guardar calificación"
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
      maxWidth="xs"
    >
      <Stack spacing={2}>
        {evaluation?.grade !== undefined && (
          <Alert severity="info">
            Calificación actual: {formatGrade(evaluation.grade)}. Al guardar, se
            reemplazará por el nuevo valor.
          </Alert>
        )}
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Calificación"
              type="number"
              autoFocus
              fullWidth
              error={Boolean(errors.grade)}
              helperText={errors.grade?.message ?? 'Escala de 1,0 a 7,0'}
              slotProps={{ htmlInput: { min: 1, max: 7, step: 0.1 } }}
            />
          )}
        />
        <Typography variant="caption" color="text.secondary">
          Al guardar, la evaluación se marcará como revisada y la nota se incluirá en
          tu promedio académico.
        </Typography>
      </Stack>
    </FormDialog>
  );
}
