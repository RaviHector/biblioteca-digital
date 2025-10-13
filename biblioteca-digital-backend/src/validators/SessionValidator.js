import { z } from 'zod';

import validate from './validate.js';

export const login = validate(
  z.object({
    body: z.object({
      email: z
        .string({ required_error: 'Email é obrigatório' })
        .email('Email deve ser válido'),
      password: z
        .string({ required_error: 'Senha é obrigatória' })
        .min(6, 'A senha deve ter pelo menos 6 caracteres'),
    }),
    signedCookies: z.object({
      token: z.string().or(z.boolean()).optional(),
    }),
  }),
);

export const logout = validate(
  z.object({
    signedCookies: z.object({
      token: z.string().optional(),
    }),
  }),
);

export const refresh = validate(
  z.object({
    signedCookies: z.object({
      token: z.string().optional(),
    }),
  }),
);
