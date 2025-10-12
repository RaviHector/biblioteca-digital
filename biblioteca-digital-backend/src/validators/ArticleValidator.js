import { z } from "zod";

import objectIdSchema from "../utils/libs/zod/objectIdSchema.js";
import validate from "./validate.js";

export const get = validate(
  z.object({
    query: z.object({
      _id: objectIdSchema("Article _id").optional(),
      title: z.string().optional(),
      author: z.string().optional(),
      edition: objectIdSchema("EditionId").optional(),
      year: z.string().optional(),
      first_page: z.string().optional(),
      last_page: z.string().optional(),
    }),
  })
);

export const getById = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("Article _id"),
    }),
  })
);

export const create = validate(
  z.object({
    body: z.object({
      title: z
        .string({ required_error: "Article name is required" })
        .min(3, "Article name must be atleast 3 characters")
        .max(100, "Article name must be a maximum of 100 characters"),
      year: z
        .string({ required_error: "Article year is required" })
        .min(4, "Article year must be atleast 3 characters")
        .max(100, "Article year must be a maximum of 100 characters"),
      author: z
        .string({ required_error: "Article author is required" })
        .min(2, "Article author must be atleast 3 characters")
        .max(30, "Article author must be a maximum of 5 characters"),
      edition: objectIdSchema("Edition _id"),
      first_page: z
        .string({ required_error: "Article page is required" })
        .min(1, "Article page must be atleast 3 characters")
        .max(3, "Article page must be a maximum of 5 characters"),
      last_page: z
        .string({ required_error: "Article page is required" })
        .min(1, "Article page must be atleast 3 characters")
        .max(3, "Article page must be a maximum of 5 characters"),
    }),
  })
);

export const update = validate(
  z.object({
    body: z.object({
      year: z
        .string()
        .min(3, "Edition name must be atleast 3 characters")
        .max(40, "Edition name must be a maximum of 40 characters")
        .optional(),
      place: z
        .string()
        .min(2, "Sigla name must be atleast 3 characters")
        .max(5, "Sigla name must be a maximum of 5 characters")
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
      name: z.string().default(""),
      _id: objectIdSchema("Edition _id").optional(),
    }),
  })
);
