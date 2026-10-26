import { z } from 'zod';
import { EVALUATION_STATUSES, EVALUATION_TYPES } from '@/types';

const dateField = z
  .string()
  .min(1, 'Selecciona una fecha.')
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), 'Usa una fecha válida.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Usa una fecha válida.');

const optionalPercent = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || (Number(value) >= 0 && Number(value) <= 100),
    'La ponderación debe estar entre 0 y 100.',
  );

const optionalPositiveNumber = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || (Number(value) > 0 && Number.isFinite(Number(value))),
    'El puntaje máximo debe ser mayor que 0.',
  );

const optionalGrade = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || (Number(value) >= 1 && Number(value) <= 7),
    'La calificación debe estar entre 1,0 y 7,0.',
  );

export const evaluationSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'El título debe tener al menos 3 caracteres.')
      .max(120, 'Máximo 120 caracteres.'),
    description: z
      .string()
      .trim()
      .min(5, 'La descripción debe tener al menos 5 caracteres.')
      .max(500, 'Máximo 500 caracteres.'),
    subjectId: z.string().min(1, 'Selecciona una asignatura.'),
    type: z.enum(EVALUATION_TYPES, {
      errorMap: () => ({ message: 'Selecciona un tipo de evaluación.' }),
    }),
    date: dateField,
    weighting: optionalPercent,
    maxScore: optionalPositiveNumber,
    grade: optionalGrade,
    status: z.enum(EVALUATION_STATUSES, {
      errorMap: () => ({ message: 'Selecciona un estado.' }),
    }),
  })
  .superRefine((values, context) => {
    if (values.status === 'programada' && values.grade.trim() !== '') {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grade'],
        message: 'Una evaluación programada no puede tener calificación.',
      });
    }
  });

export const gradeSchema = z.object({
  grade: z
    .string()
    .trim()
    .min(1, 'Ingresa una calificación.')
    .refine(
      (value) => Number(value) >= 1 && Number(value) <= 7,
      'La calificación debe estar entre 1,0 y 7,0.',
    ),
});

export type EvaluationFormValues = z.infer<typeof evaluationSchema>;
export type GradeFormValues = z.infer<typeof gradeSchema>;
