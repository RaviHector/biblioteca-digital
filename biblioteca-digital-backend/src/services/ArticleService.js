import { NotFoundError } from "../errors/baseErrors.js";
import ArticleModel from "../models/ArticleModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return ArticleModel.find(inputFilters)
    .populate(COLLECTION_NAMES.ARTICLE)
    .lean()
    .exec();
}

export async function getById(_id) {
  const foundArticle = await ArticleModel.findById(_id)
    .populate(COLLECTION_NAMES.ARTICLE)
    .lean()
    .exec();
  if (!foundArticle) throw new NotFoundError("Article not found");
  return foundArticle;
}

export async function create(inputData) {
  return ArticleModel.create(inputData);
}

export async function update({ _id, inputData }) {
  const foundArticle = await ArticleModel.findById(_id).exec();
  if (!foundArticle) throw new NotFoundError("Article not found");

  return foundArticle.set(inputData).save();
}

export async function destroy(_id) {
  const foundArticle = await ArticleModelModel.findById(_id).exec();
  if (!foundArticle) throw new NotFoundError("Article not found");

  await foundArticle.deleteOne();
}

export async function searchByName({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) query.name = { $regex: convertStringToRegexp(name) };

  return ArticleModel.find(query)
    .populate(COLLECTION_NAMES.EDITION)
    .sort("name")
    .lean()
    .exec();
}

export async function searchArticle({ searchTerm, inputFilters }) {
    const query = { ...inputFilters };
    if (searchTerm) {
    const regex = convertStringToRegexp(searchTerm); 
      query.$or = [
      { title: regex },
      { author: regex },
      { edition: regex },
      { year: regex },
    ];
  }
  return ArticleModel.find(query).sort("name").lean().exec();
}