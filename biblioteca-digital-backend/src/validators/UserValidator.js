import { z } from "zod";

import objectIdSchema from "../utils/libs/zod/objectIdSchema.js";
import validate from "./validate.js";

export const get = validate(
  z.object({
    query: z.object({
      _id: objectIdSchema("User _id").optional(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      isAdmin: z.boolean().optional(),
    }),
  })
);

export const getById = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("User _id"),
    }),
  })
);

export const create = validate(
  z.object({
    body: z.object({
      name: z
        .string({ required_error: "Nome é obrigatório" })
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(40, "Nome deve ter no máximo 40 caracteres"),
      email: z
        .string({ required_error: "Email é obrigatório" })
        .email("Email deve ser válido")
        .max(160, "Email deve ter no máximo 160 caracteres"),
      password: z
        .string({ required_error: "Senha é obrigatória" })
        .min(6, "Senha deve ter pelo menos 6 caracteres")
        .max(16, "Senha deve ter no máximo 16 caracteres"),
      isAdmin: z
        .boolean()
        .default(false)
        .optional(),
    }),
  })
);

export const verifyEmail = validate(
  z.object({
    params: z.object({
      token: z.string({ required_error: "User email token is required" }),
    }),
  })
);

export const forgotPassword = validate(
  z.object({
    body: z.object({
      email: z.string({ required_error: "User email is required" }),
    }),
  })
);

export const redefinePassword = validate(
  z.object({
    body: z.object({
      newPassword: z.string({ required_error: "Uer new password is required" }),
    }),
    params: z.object({
      token: z.string({
        required_error: "User forgot password token is required",
      }),
    }),
  })
);

export const update = validate(
  z.object({
    body: z.object({
      name: z
        .string()
        .min(3, "User name must be atleast 3 characters")
        .max(40, "User name must be a maximum of 40 characters")
        .optional(),
      role: z
        .string()
        .min(3, "User role must be atleast 3 characters")
        .max(40, "User role must be a maximum of 40 characters")
        .optional(),
    }),
    params: z.object({
      _id: objectIdSchema("User _id"),
    }),
  })
);

export const destroy = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("User _id"),
    }),
  })
);
