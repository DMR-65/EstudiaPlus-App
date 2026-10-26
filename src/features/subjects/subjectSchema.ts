import { z } from 'zod';

export const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa el nombre de la asignatura.')
    .max(80, 'Máximo 80 caracteres.'),
  description: z
    .string()
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(300, 'Máximo 300 caracteres.'),
  teacher: z
    .string()
    .trim()
    .min(3, 'Ingresa el nombre del profesor.')
    .max(80, 'Máximo 80 caracteres.'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Selecciona un color válido.'),
  isActive: z.boolean(),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
