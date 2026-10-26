import { z } from 'zod';
import { SHIFTS } from '@/types';

export const studentSchema = z.object({
  name: z.string().trim().min(3, 'Ingresa el nombre completo.').max(80, 'Máximo 80 caracteres.'),
  course: z.string().trim().min(2, 'Ingresa el curso.').max(40, 'Máximo 40 caracteres.'),
  school: z.string().trim().min(3, 'Ingresa el establecimiento.').max(100, 'Máximo 100 caracteres.'),
  academicYear: z
    .string()
    .trim()
    .min(1, 'Ingresa el año académico.')
    .refine((value) => /^\d{4}$/.test(value), 'Usa un año de 4 dígitos.')
    .refine((value) => {
      const year = Number(value);
      return year >= 2000 && year <= 2100;
    }, 'El año debe estar entre 2000 y 2100.'),
  email: z.string().trim().min(1, 'Ingresa el correo.').email('Ingresa un correo válido.'),
  guardianName: z
    .string()
    .trim()
    .min(3, 'Ingresa el nombre del apoderado.')
    .max(80, 'Máximo 80 caracteres.'),
  shift: z.enum(SHIFTS, { errorMap: () => ({ message: 'Selecciona una jornada.' }) }),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
