import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/types';

const dateField = z
  .string()
  .min(1, 'Selecciona una fecha.')
  .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), 'Usa una fecha válida.')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Usa una fecha válida.');

export const taskSchema = z
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
    assignedDate: dateField,
    dueDate: dateField,
    priority: z.enum(TASK_PRIORITIES, {
      errorMap: () => ({ message: 'Selecciona una prioridad.' }),
    }),
    status: z.enum(TASK_STATUSES, {
      errorMap: () => ({ message: 'Selecciona un estado.' }),
    }),
  })
  .refine((values) => values.dueDate >= values.assignedDate, {
    message: 'La fecha de entrega no puede ser anterior a la fecha de asignación.',
    path: ['dueDate'],
  });

export type TaskFormValues = z.infer<typeof taskSchema>;
