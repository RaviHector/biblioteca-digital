import mongoose from 'mongoose';

import { COLLECTION_NAMES } from '../utils/general/constants';
import { ObjectId } from '../config/mongo';

const EmailLinkShema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: COLLECTION_NAMES.USER,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
    select: false,
  },
});

EmailLinkShema.pre('save', async function (next) {
  // only hash the password if it has been modified or it is new
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});

const EmailLinkModel = mongoose.model(
  COLLECTION_NAMES.EMAIL_LINK,
  EmailLinkShema,
);
export default EmailLinkModel;
