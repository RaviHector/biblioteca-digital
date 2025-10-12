import mongoose from "mongoose";

import { COLLECTION_NAMES } from "../utils/general/constants.js";
import { ObjectId } from "../config/mongo.js";

const EditionsSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    event: {
      type: ObjectId,
      ref: COLLECTION_NAMES.EVENT,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
);

const EditionsModel = mongoose.model(COLLECTION_NAMES.EDITION, EditionsSchema);
export default EditionsModel;
