import { z } from "zod";

import objectIdSchema from "../utils/libs/zod/objectIdSchema.js";
import validate from "./validate.js";

export const get = validate(
  z.object({
    query: z.object({
      _id: objectIdSchema("Events _id").optional(),
      name: z.string().optional(),
      sigla: z.string().optional(),
      entity: z.string().optional(),
    }),
  })
);

export const getById = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("Events _id"),
    }),
  })
);

export const create = validate(
  z.object({
    body: z.object({
      name: z
        .string({ required_error: "Events name is required" })
        .min(3, "Events name must be atleast 3 characters")
        .max(100, "Events name must be a maximum of 100 characters"),
      sigla: z
        .string({ required_error: "Sigla name is required" })
        .min(2, "Sigla name must be atleast 3 characters")
        .max(5, "Sigla name must be a maximum of 5 characters"),
      entity: z
        .string({ required_error: "Entity name is required" })
        .min(3, "Entity name must be atleast 3 characters")
        .max(100, "Entity name must be a maximum of 100 characters"),
    }),
  })
);

export const update = validate(
  z.object({
    body: z.object({
      name: z
        .string()
        .min(3, "Events name must be atleast 3 characters")
        .max(40, "Events name must be a maximum of 40 characters")
        .optional(),
      sigla: z
        .string()
        .min(2, "Sigla name must be atleast 3 characters")
        .max(5, "Sigla name must be a maximum of 5 characters")
        .optional(),
      entity: z
        .string()
        .min(3, "Entity name must be atleast 3 characters")
        .max(100, "Entity name must be a maximum of 100 characters")
        .optional(),
    }),
    params: z.object({
      _id: objectIdSchema("Events _id"),
    }),
  })
);

export const destroy = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("Events _id"),
    }),
  })
);

export const searchByName = validate(
  z.object({
    query: z.object({
      name: z.string().default(""),
      _id: objectIdSchema("Events _id").optional(),
    }),
  })
);

export const searchEvents = validate(
  z.object({
    // Valida o objeto 'query' da requisição (req.query)
    query: z
      .object({
        // O termo de busca principal. É opcional para permitir buscas apenas com filtros.
        searchTerm: z.string().optional(),

        // Mantém outros filtros que você queira validar explicitamente.
        _id: objectIdSchema("Events _id").optional(),
      })
      // Permite que quaisquer outros campos de query sejam passados sem gerar erro.
      // Essencial para que os '...inputFilters' funcionem.
      .passthrough(),
  })
);