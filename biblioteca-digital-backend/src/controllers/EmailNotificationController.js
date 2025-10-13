import * as EmailNotificationService from "../services/EmailNotificationService.js";
import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import * as EmailNotificationValidator from "../validators/EmailNotificationValidator.js";

export const subscribe = asyncHandler(async (req, res) => {
  const inputData = EmailNotificationValidator.subscribe(req);
  const subscription = await EmailNotificationService.subscribe(inputData);

  res.status(SUCCESS_CODES.CREATED).json({
    message: "Email cadastrado com sucesso para receber notificações",
    subscription
  });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { email, name } = EmailNotificationValidator.unsubscribe(req);
  await EmailNotificationService.unsubscribe({ email, name });

  res.status(SUCCESS_CODES.OK).json({
    message: "Email removido das notificações com sucesso"
  });
});

export const getAll = asyncHandler(async (req, res) => {
  const subscriptions = await EmailNotificationService.getAll();
  res.status(SUCCESS_CODES.OK).json(subscriptions);
});

export const getByName = asyncHandler(async (req, res) => {
  const { name } = EmailNotificationValidator.getByName(req);
  const subscriptions = await EmailNotificationService.getByName(name);
  res.status(SUCCESS_CODES.OK).json(subscriptions);
});

export const toggleActive = asyncHandler(async (req, res) => {
  const { id, isActive } = EmailNotificationValidator.toggleActive(req);
  const updated = await EmailNotificationService.toggleActive(id, isActive);
  
  res.status(SUCCESS_CODES.OK).json({
    message: `Notificação ${isActive ? 'ativada' : 'desativada'} com sucesso`,
    subscription: updated
  });
});