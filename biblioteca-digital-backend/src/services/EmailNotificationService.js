import { ConflictError, NotFoundError } from "../errors/baseErrors.js";
import EmailNotificationModel from "../models/EmailNotificationModel.js";

export async function subscribe(inputData) {
  try {
    return await EmailNotificationModel.create(inputData);
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictError("Este email já está cadastrado para notificações deste autor");
    }
    throw error;
  }
}

export async function unsubscribe({ email, name }) {
  const found = await EmailNotificationModel.findOneAndDelete({ 
    email: email.toLowerCase().trim(),
    name: name.trim()
  });
  
  if (!found) {
    throw new NotFoundError("Inscrição não encontrada");
  }
  
  return found;
}

export async function getAll() {
  return EmailNotificationModel.find({ isActive: true }).lean().exec();
}

export async function getByName(name) {
  return EmailNotificationModel.find({ 
    name: { $regex: name.trim(), $options: 'i' },
    isActive: true 
  }).lean().exec();
}

export async function getByEmail(email) {
  return EmailNotificationModel.find({ 
    email: email.toLowerCase().trim(),
    isActive: true 
  }).lean().exec();
}

export async function toggleActive(id, isActive) {
  const found = await EmailNotificationModel.findById(id);
  if (!found) {
    throw new NotFoundError("Inscrição não encontrada");
  }
  
  found.isActive = isActive;
  return await found.save();
}