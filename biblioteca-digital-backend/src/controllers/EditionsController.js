import * as EditionsService from "../services/EditionsService.js";
import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import * as EditionsValidator from "../validators/EditionsValidator.js";

export const get = asyncHandler(async (req, res) => {
  const inputFilters = EditionsValidator.get(req);
  const categories = await EditionsService.get(inputFilters);

  res.status(SUCCESS_CODES.OK).json(categories);
});

export const getById = asyncHandler(async (req, res) => {
  const { _id } = EditionsValidator.getById(req);
  const Editions = await EditionsService.getById(_id);

  res.status(SUCCESS_CODES.OK).json(Editions);
});

export const create = asyncHandler(async (req, res) => {
  const inputData = EditionsValidator.create(req);
  const newEditions = await EditionsService.create(inputData);

  res.status(SUCCESS_CODES.CREATED).json(newEditions);
});

export const update = asyncHandler(async (req, res) => {
  const { _id, ...inputData } = EditionsValidator.update(req);
  const updatedEditions = await EditionsService.update({ _id, inputData });

  res.status(SUCCESS_CODES.OK).json(updatedEditions);
});

export const destroy = asyncHandler(async (req, res) => {
  const { _id } = EditionsValidator.destroy(req);
  await EditionsService.destroy(_id);

  res.sendStatus(SUCCESS_CODES.NO_CONTENT);
});

export const searchByName = asyncHandler(async (req, res) => {
  const { name, ...inputFilters } = EditionsValidator.searchByName(req);
  const categories = await EditionsService.searchByName({
    name,
    inputFilters,
  });

  res.status(SUCCESS_CODES.OK).json(categories);
});

export const searchEditions = asyncHandler(async (req, res) => {
  const { name, ...inputFilters } = EditionsValidator.searchByName(req);
  const editions = await EditionsService.searchEditions({
    name,
    inputFilters,
  });
  res.status(SUCCESS_CODES.OK).json(editions);
});
