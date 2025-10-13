import { z } from "zod";

import objectIdSchema from "../utils/libs/zod/objectIdSchema.js";
import validate from "./validate.js";

export const get = validate(
  z.object({
    query: z.object({
      _id: objectIdSchema("Edition _id").optional(),
      year: z.string().optional(),
      place: z.string().optional(),
      event: objectIdSchema("EventId").optional(),
    }),
  })
);

export const getById = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("Edition _id"),
    }),
  })
);

export const create = validate(
  z.object({
    body: z.object({
      year: z
        .string({ required_error: "Editions year is required" })
        .min(3, "Editions year must be atleast 3 characters")
        .max(100, "Editions year must be a maximum of 100 characters"),
      place: z
        .string({ required_error: "Sigla place is required" })
        .min(2, "Sigla place must be atleast 3 characters")
        .max(100, "Sigla place must be a maximum of 5 characters"),
      event: objectIdSchema("Event _id"),
    }),
  })
);

export const update = validate(
  z.object({
    body: z.object({
      year: z
        .string()
        .min(3, "Editions name must be atleast 3 characters")
        .max(40, "Editions name must be a maximum of 40 characters")
        .optional(),
      place: z
        .string()
        .min(2, "Sigla name must be atleast 3 characters")
        .max(100, "Sigla name must be a maximum of 5 characters")
        .optional(),
      event: objectIdSchema("Event _id"),
    }),
    params: z.object({
      _id: objectIdSchema("Edition _id"),
    }),
  })
);

export const destroy = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("Edition _id"),
    }),
  })
);

export const searchByName = validate(
  z.object({
    query: z.object({
      name: z.string().default("").optional(),
    }),
  })
);
