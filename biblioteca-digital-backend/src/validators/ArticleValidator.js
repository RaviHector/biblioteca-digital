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
        .array(z.string().min(2, "Author name must be at least 2 characters"))
        .min(1, "At least one author is required")
        .max(10, "Maximum 10 authors allowed"),
      edition: objectIdSchema("Edition _id"),
      first_page: z
        .string({ required_error: "Article page is required" })
        .min(1, "Article page must be at least 1 character")
        .max(10, "Article page must be a maximum of 10 characters"),
      last_page: z
        .string({ required_error: "Article page is required" })
        .min(1, "Article page must be at least 1 character")
        .max(10, "Article page must be a maximum of 10 characters"),
    }),
  })
);

export const update = validate(
  z.object({
    body: z.object({
      title: z
        .string()
        .min(3, "Article name must be at least 3 characters")
        .max(100, "Article name must be a maximum of 100 characters")
        .optional(),
      year: z
        .string()
        .min(4, "Article year must be at least 4 characters")
        .max(100, "Article year must be a maximum of 100 characters")
        .optional(),
      author: z
        .array(z.string().min(2, "Author name must be at least 2 characters"))
        .min(1, "At least one author is required")
        .max(10, "Maximum 10 authors allowed")
        .optional(),
      edition: objectIdSchema("Edition _id").optional(),
      event: objectIdSchema("Event _id").optional(),
      first_page: z
        .string()
        .min(1, "Article page must be at least 1 character")
        .max(10, "Article page must be a maximum of 10 characters")
        .optional(),
      last_page: z
        .string()
        .min(1, "Article page must be at least 1 character")
        .max(10, "Article page must be a maximum of 10 characters")
        .optional(),
    }),
    params: z.object({
      _id: objectIdSchema("Article _id"),
    }),
  })
);

export const destroy = validate(
  z.object({
    params: z.object({
      _id: objectIdSchema("Article _id"),
    }),
  })
);

export const searchByName = validate(
  z.object({
    query: z.object({
      name: z.string().default(""),
      _id: objectIdSchema("Article _id").optional(),
    }),
  })
);
