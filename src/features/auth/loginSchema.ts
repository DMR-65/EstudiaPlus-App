import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Ingresa tu usuario o correo electrónico.'),
  password: z.string().min(1, 'Ingresa tu contraseña.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
