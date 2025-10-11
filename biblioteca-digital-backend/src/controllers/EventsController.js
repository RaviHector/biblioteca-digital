import * as EventsService from "../services/EventsService.js";
import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import * as EventsValidator from "../validators/EventsValidator.js";

export const get = asyncHandler(async (req, res) => {
  const inputFilters = EventsValidator.get(req);
  const categories = await EventsService.get(inputFilters);

  res.status(SUCCESS_CODES.OK).json(categories);
});

export const getById = asyncHandler(async (req, res) => {
  const { _id } = EventsValidator.getById(req);
  const Events = await EventsService.getById(_id);

  res.status(SUCCESS_CODES.OK).json(Events);
});

export const create = asyncHandler(async (req, res) => {
  const inputData = EventsValidator.create(req);
  const newEvents = await EventsService.create(inputData);

  res.status(SUCCESS_CODES.CREATED).json(newEvents);
});

export const update = asyncHandler(async (req, res) => {
  const { _id, ...inputData } = EventsValidator.update(req);
  const updatedEvents = await EventsService.update({ _id, inputData });

  res.status(SUCCESS_CODES.OK).json(updatedEvents);
});

export const destroy = asyncHandler(async (req, res) => {
  const { _id } = EventsValidator.destroy(req);
  await EventsService.destroy(_id);

  res.sendStatus(SUCCESS_CODES.NO_CONTENT);
});

export const searchByName = asyncHandler(async (req, res) => {
  const { name, ...inputFilters } = EventsValidator.searchByName(req);
  const categories = await EventsService.searchByName({
    name,
    inputFilters,
  });

  res.status(SUCCESS_CODES.OK).json(categories);
});
