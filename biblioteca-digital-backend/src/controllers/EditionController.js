import * as EditionService from "../services/EditionService.js";
import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import * as EditionValidator from "../validators/EditionValidator.js";

export const get = asyncHandler(async (req, res) => {
  const inputFilters = EditionValidator.get(req);
  const categories = await EditionService.get(inputFilters);

  res.status(SUCCESS_CODES.OK).json(categories);
});

export const getById = asyncHandler(async (req, res) => {
  const { _id } = EditionValidator.getById(req);
  const Edition = await EditionService.getById(_id);

  res.status(SUCCESS_CODES.OK).json(Edition);
});

export const create = asyncHandler(async (req, res) => {
  const inputData = EditionValidator.create(req);
  const newEdition = await EditionService.create(inputData);

  res.status(SUCCESS_CODES.CREATED).json(newEdition);
});

export const update = asyncHandler(async (req, res) => {
  const { _id, ...inputData } = EditionValidator.update(req);
  const updatedEdition = await EditionService.update({ _id, inputData });

  res.status(SUCCESS_CODES.OK).json(updatedEdition);
});

export const destroy = asyncHandler(async (req, res) => {
  const { _id } = EditionValidator.destroy(req);
  await EditionService.destroy(_id);

  res.sendStatus(SUCCESS_CODES.NO_CONTENT);
});

export const searchByName = asyncHandler(async (req, res) => {
  const { name, ...inputFilters } = EditionValidator.searchByName(req);
  const categories = await EditionService.searchByName({
    name,
    inputFilters,
  });

  res.status(SUCCESS_CODES.OK).json(categories);
});
