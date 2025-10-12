import mongoose from "mongoose";

import { COLLECTION_NAMES } from "../utils/general/constants.js";
import { ObjectId } from "../config/mongo.js";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    author: {
      type: Array,
      required: true,
      trim: true,
    },
    edition: {
      type: ObjectId,
      ref: COLLECTION_NAMES.EDITION,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    first_page: {
      type: String,
      required: true,
      trim: true,
    },
    last_page: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
);

const ArticleModel = mongoose.model(COLLECTION_NAMES.ARTICLE, ArticleSchema);
export default ArticleModel;
