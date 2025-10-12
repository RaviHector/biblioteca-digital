import mongoose from "mongoose";
import { NotFoundError } from "../errors/baseErrors.js";
import ArticleModel from "../models/ArticleModel.js";
import EditionsModel from "../models/EditionsModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return ArticleModel.find(inputFilters)
    .populate({
      path: "edition",
      populate: {
        path: "event"
      }
    })
    .lean()
    .exec();
}

export async function getById(_id) {
  const foundArticle = await ArticleModel.findById(_id)
    .populate({
      path: "edition",
      populate: {
        path: "event"
      }
    })
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
  const foundArticle = await ArticleModel.findById(_id).exec();
  if (!foundArticle) throw new NotFoundError("Article not found");

  await foundArticle.deleteOne();
}

export async function searchByName({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) query.name = { $regex: convertStringToRegexp(name) };

  return ArticleModel.find(query)
    .populate({
      path: "edition",
      populate: {
        path: "event"
      }
    })
    .sort("title")
    .lean()
    .exec();
}

export async function searchArticle({ name, inputFilters = {} }) {
  const query = { ...inputFilters };

  // popula sempre a edição e o evento
  const populateOpts = {
    path: "edition",
    populate: { path: "event" },
  };

  if (!name) {
    return ArticleModel.find(query)
      .populate(populateOpts)
      .sort("title")
      .lean()
      .exec();
  }

  const regex = convertStringToRegexp(name);

  // Busca direta em Article: title OU algum elemento do array author
  const directQuery = {
    ...query,
    $or: [
      { title: { $regex: regex } },
      { author: { $elemMatch: { $regex: regex } } },
    ],
  };

  const directMatches = await ArticleModel.find(directQuery)
    .populate(populateOpts)
    .lean()
    .exec();

  // Busca Events por name ou sigla
  const EventModel = mongoose.model(COLLECTION_NAMES.EVENT);
  const events = await EventModel.find({
    $or: [{ name: { $regex: regex } }, { sigla: { $regex: regex } }],
  })
    .lean()
    .exec();

  // Se não encontrou events, não há edições indiretas — mas não retornamos cedo, apenas prosseguimos
  const eventIds = events.length ? events.map((e) => e._id) : [];
  console.log("eventIds encontrados:", eventIds);

  // Busca Editions das events encontradas (pode resultar em [] sem problemas)
  const EditionModel = mongoose.model(COLLECTION_NAMES.EDITION);
  const editions = eventIds.length
    ? await EditionModel.find({ event: { $in: eventIds } })
        .lean()
        .exec()
    : [];
  console.log("Events encontrados:", editions);

  const editionIds = editions.length ? editions.map((ed) => ed._id) : [];

  // Busca artigos dessas edições (se editionIds vazio, a query resulta em [])
  const indirectMatches = editionIds.length
    ? await ArticleModel.find({ edition: { $in: editionIds } })
        .populate(populateOpts)
        .lean()
        .exec()
    : [];

  // Junta diretos + indiretos removendo duplicados por _id
  const map = new Map();
  directMatches.forEach((a) => map.set(String(a._id), a));
  indirectMatches.forEach((a) => map.set(String(a._id), a)); // sobrescreve apenas se não existir

  const allMatches = Array.from(map.values());

  // Ordena por title (ou outro campo se preferir)
  allMatches.sort((x, y) => {
    if (!x.title) return -1;
    if (!y.title) return 1;
    return x.title.localeCompare(y.title);
  });

  return allMatches;
}
