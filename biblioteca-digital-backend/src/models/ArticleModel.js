import mongoose from "mongoose";

import { COLLECTION_NAMES } from "../utils/general/constants.js";
import EditionModel from "./EditionsModel.js";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,

    },
    author: {
      type: String,
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

const EventsModel = mongoose.model(COLLECTION_NAMES.EVENT, EventsSchema);
export default EventsModel;
