import mongoose from "mongoose";

import { COLLECTION_NAMES } from "../utils/general/constants.js";
import EditionModel from "./EditionsModel.js";

const EventsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    sigla: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { versionKey: false }
);

// Delete all products inside the removed category
EventsSchema.pre(
  "deleteOne",
  { document: true, query: false }, // More details on https://mongoosejs.com/docs/api/schema.html#schema_Schema-pre
  async function (next) {
    await EditionModel.deleteMany({ entity: this._id }).exec();
    next();
  }
); // More details on https://stackoverflow.com/questions/14348516/cascade-style-delete-in-mongoose
const EventsModel = mongoose.model(COLLECTION_NAMES.EVENT, EventsSchema);
export default EventsModel;
