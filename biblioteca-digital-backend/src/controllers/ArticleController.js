import * as ArticleService from "../services/ArticleService.js";
import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import * as ArticleValidator from "../validators/ArticleValidator.js";

export const get = asyncHandler(async (req, res) => {
  const inputFilters = ArticleValidator.get(req);
  const categories = await ArticleService.get(inputFilters);

  res.status(SUCCESS_CODES.OK).json(categories);
});

export const getById = asyncHandler(async (req, res) => {
  const { _id } = ArticleValidator.getById(req);
  const Article = await ArticleService.getById(_id);

  res.status(SUCCESS_CODES.OK).json(Article);
});

export const create = asyncHandler(async (req, res) => {
  const inputData = ArticleValidator.create(req);
  const newArticle = await ArticleService.create(inputData);

  res.status(SUCCESS_CODES.CREATED).json(newArticle);
});

export const update = asyncHandler(async (req, res) => {
  const { _id, ...inputData } = ArticleValidator.update(req);
  const updatedArticle = await ArticleService.update({ _id, inputData });

  res.status(SUCCESS_CODES.OK).json(updatedArticle);
});

export const destroy = asyncHandler(async (req, res) => {
  const { _id } = ArticleValidator.destroy(req);
  await ArticleService.destroy(_id);

  res.sendStatus(SUCCESS_CODES.NO_CONTENT);
});

export const searchByName = asyncHandler(async (req, res) => {
  const { name, ...inputFilters } = ArticleValidator.searchByName(req);
  const categories = await ArticleService.searchByName({
    name,
    inputFilters,
  });

  res.status(SUCCESS_CODES.OK).json(categories);
});

export const searchArticle = asyncHandler(async (req, res) => {
  const { name, ...inputFilters } = ArticleValidator.searchByName(req);
  const articles = await ArticleService.searchArticle({
    name,
    inputFilters,
  });
  res.status(SUCCESS_CODES.OK).json(articles);
});
