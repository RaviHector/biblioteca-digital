import mongoose from "mongoose";

import { COLLECTION_NAMES } from "../utils/general/constants.js";
import { hashPassword } from "../utils/libs/bcrypt.js";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // A senha só será incluída em consultas quando explicitamente solicitada
    },

    isAdmin: {
      type: Boolean,
      required: false,
      default: false, // False means user is a normal user (not admin)
    },
  },
  { timestamps: true, versionKey: false }
);

// Removido o middleware de hash de senha, pois isso já é feito no UserService

UserSchema.pre(
  "deleteOne",
  { document: true, query: false }, // More details on https://mongoosejs.com/docs/api/schema.html#schema_Schema-pre
  async function () {
    return Promise.all([
      UserSessionTokenModel.deleteMany({ user: this._id }).exec(),
    ]);
  }
);

const UserModel = mongoose.model(COLLECTION_NAMES.USER, UserSchema);
export default UserModel;
