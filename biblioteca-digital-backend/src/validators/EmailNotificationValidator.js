import { z } from "zod";
import validate from "./validate.js";

const subscribeSchema = z.object({
  name: z
    .string({
      required_error: "Nome do autor é obrigatório",
      invalid_type_error: "Nome deve ser uma string",
    })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  
  email: z
    .string({
      required_error: "Email é obrigatório",
      invalid_type_error: "Email deve ser uma string",
    })
    .email("Email deve ter um formato válido")
    .trim()
    .toLowerCase(),
});

const unsubscribeSchema = z.object({
  name: z
    .string({
      required_error: "Nome do autor é obrigatório",
    })
    .min(1, "Nome é obrigatório")
    .trim(),
    
  email: z
    .string({
      required_error: "Email é obrigatório",
    })
    .email("Email deve ter um formato válido")
    .trim()
    .toLowerCase(),
});



export const subscribe = validate(
  z.object({
    body: subscribeSchema,
  })
);

export const unsubscribe = validate(
  z.object({
    body: unsubscribeSchema,
  })
);

export const getByName = validate(
  z.object({
    query: z.object({
      name: z
        .string({
          required_error: "Nome é obrigatório",
        })
        .min(1, "Nome não pode estar vazio")
        .trim(),
    }),
  })
);

export const toggleActive = validate(
  z.object({
    params: z.object({
      id: z
        .string({
          required_error: "ID é obrigatório",
        })
        .regex(/^[0-9a-fA-F]{24}$/, "ID deve ser um ObjectId válido"),
    }),
    body: z.object({
      isActive: z
        .boolean({
          required_error: "Status é obrigatório",
          invalid_type_error: "Status deve ser um booleano",
        }),
    }),
  })
);