import { z } from 'zod';

export const LoginDTOSchema = z.object({
  email: z.string().email('El email debe ser válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
export type LoginDTO = z.infer<typeof LoginDTOSchema>;

export const SignUpSchema = z.object({
  email: z.string().email('El email debe ser válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  username: z
    .string()
    .min(2, 'El nombre de usuario debe tener al menos 2 caracteres'),
});
export type SignUpDTO = z.infer<typeof SignUpSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  provider: z.enum(['local', 'google']),
  googleId: z.string().uuid().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type User = z.infer<typeof UserSchema>;

export interface FormData {
  username?: string;
  email: string;
  password: string;
}
