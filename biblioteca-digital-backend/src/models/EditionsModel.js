import mongoose from "mongoose";
import { ObjectId } from "../config/mongo.js";

import { COLLECTION_NAMES } from "../utils/general/constants.js";

//import { ObjectId } from "../config/mongo.js";

import ArticleModel from "./ArticleModel.js";

const EditionsSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      trim: true,
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
// Delete all products inside the removed category
EditionsSchema.pre(
  "deleteOne",
  { document: true, query: false }, // More details on https://mongoosejs.com/docs/api/schema.html#schema_Schema-pre
  async function (next) {
    await ArticleModel.deleteMany({ edition: this._id }).exec();
    next();
  }
); // More details on https://stackoverflow.com/questions/14348516/cascade-style-delete-in-mongoose
const EditionsModel = mongoose.model(COLLECTION_NAMES.EDITION, EditionsSchema);
export default EditionsModel;
