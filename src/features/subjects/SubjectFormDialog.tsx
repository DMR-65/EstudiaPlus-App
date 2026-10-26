import { useEffect } from 'react';
import {
  Box,
  ButtonBase,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { FormDialog } from '@/components/common/FormDialog';
import { subjectSchema } from '@/features/subjects/subjectSchema';
import type { SubjectFormValues } from '@/features/subjects/subjectSchema';
import type { Subject, SubjectDraft } from '@/types';
import { SUBJECT_COLORS } from '@/utils/constants';

interface SubjectFormDialogProps {
  open: boolean;
  subject?: Subject | null;
  onClose: () => void;
  onSubmit: (draft: SubjectDraft) => boolean;
}

const emptyValues: SubjectFormValues = {
  name: '',
  description: '',
  teacher: '',
  color: SUBJECT_COLORS[0] ?? '#2563EB',
  isActive: true,
};

export function SubjectFormDialog({
  open,
  subject,
  onClose,
  onSubmit,
}: SubjectFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      subject
        ? {
            name: subject.name,
            description: subject.description,
            teacher: subject.teacher,
            color: subject.color,
            isActive: subject.isActive,
          }
        : emptyValues,
    );
  }, [open, subject, reset]);

  const submit = (values: SubjectFormValues) => {
    const success = onSubmit(values);
    if (success) {
      onClose();
    }
  };

  return (
    <FormDialog
      open={open}
      title={subject ? 'Editar asignatura' : 'Nueva asignatura'}
      subtitle="Completa la información básica de la asignatura."
      submitLabel={subject ? 'Guardar cambios' : 'Crear asignatura'}
      onClose={onClose}
      onSubmit={handleSubmit(submit)}
    >
      <Stack spacing={2.25}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre de la asignatura"
              placeholder="Ej. Matemática"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
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
              placeholder="Breve descripción de los contenidos"
              multiline
              minRows={3}
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="teacher"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Profesor ficticio"
              placeholder="Ej. Profesora Paula Rojas"
              error={Boolean(errors.teacher)}
              helperText={errors.teacher?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <FormControl error={Boolean(errors.color)}>
              <FormLabel sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1 }}>
                Color identificador
              </FormLabel>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {SUBJECT_COLORS.map((color) => {
                  const selected = field.value.toLowerCase() === color.toLowerCase();
                  return (
                    <ButtonBase
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      aria-label={`Seleccionar color ${color}`}
                      aria-pressed={selected}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: color,
                        color: '#FFFFFF',
                        border: '2px solid',
                        borderColor: selected ? 'text.primary' : 'transparent',
                        boxShadow: selected ? '0 0 0 3px #FFFFFF inset' : 'none',
                      }}
                    >
                      {selected && <Check size={16} strokeWidth={3} />}
                    </ButtonBase>
                  );
                })}
              </Stack>
              {errors.color?.message && (
                <FormHelperText>{errors.color.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Asignatura activa
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Las asignaturas inactivas se mantienen, pero no aparecen en el resumen del inicio.
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    slotProps={{ input: { 'aria-label': 'Asignatura activa' } }}
                  />
                }
                label=""
                sx={{ m: 0 }}
              />
            </Box>
          )}
        />
      </Stack>
    </FormDialog>
  );
}
