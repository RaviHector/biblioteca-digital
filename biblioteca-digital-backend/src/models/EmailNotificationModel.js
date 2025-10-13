import mongoose, { Schema, model } from "mongoose";
import { COLLECTION_NAMES } from "../utils/general/constants.js";

const emailNotificationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  collection: COLLECTION_NAMES.EMAIL_NOTIFICATIONS,
});

// Índice composto para evitar duplicatas de email + nome
emailNotificationSchema.index({ email: 1, name: 1 }, { unique: true });

export default model("EmailNotification", emailNotificationSchema);