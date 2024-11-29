import { z } from 'zod';

export const passwordFormSchema = z
  .string({ required_error: 'Campo obrigatório' })
  .max(128, 'Limite de 128 caracteres')
  .min(8, 'Deve ter no mínimo 8 caracteres');

export const emailFormSchema = z
  .string({ required_error: 'Campo obrigatório' })
  .email({ message: 'E-mail precisa ser válido' })

export type LoginUserFormSchema = z.infer<typeof loginUserFormSchema>;
export const loginUserFormSchema = z.object({
  email: emailFormSchema,
  password: passwordFormSchema,
});

export type RegisterUserFormSchema = z.infer<typeof registerUserFormSchema>;
export const registerUserFormSchema = z.object({
  email: emailFormSchema,
  password: passwordFormSchema,
});
