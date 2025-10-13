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
      name: z.string().min(3),
      entity: z.string().min(2),
      sigla: z.string().optional(),
      date: z.string().optional(),
    }),
  })
);

export const update = validate(
  z.object({
    body: z.object({
      name: z
        .string()
        .min(3, "Events name must be atleast 3 characters")
        .max(100, "Events name must be a maximum of 100 characters")
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
    query: z
      .object({
        name: z.string().optional(),
        _id: objectIdSchema("Events _id").optional(),
      })
      .passthrough(),
  })
);
