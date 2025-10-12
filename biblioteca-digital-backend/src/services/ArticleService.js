import mongoose from "mongoose";
import { NotFoundError } from "../errors/baseErrors.js";
import ArticleModel from "../models/ArticleModel.js";
import EditionsModel from "../models/EditionsModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return ArticleModel.find(inputFilters)
    .populate({ path: "edition", populate: { path: "event" } })
    .lean()
    .exec();
}

export async function getById(_id) {
  const foundArticle = await ArticleModel.findById(_id)
    .populate({ path: "edition", populate: { path: "event" } })
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
  if (name) query.title = { $regex: convertStringToRegexp(name) };

  return ArticleModel.find(query)
    .populate({ path: "edition", populate: { path: "event" } })
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

  const regex = convertStringToRegexp(name) || new RegExp(name, "i");

  // Busca direta em Article: title OU algum elemento do array author OU year
  const directQuery = {
    ...query,
    $or: [
      { title: { $regex: regex } },
      { author: { $elemMatch: { $regex: regex } } },
      { year: { $regex: regex } },
    ],
  };

  const directMatches = await ArticleModel.find(directQuery)
    .populate(populateOpts)
    .lean()
    .exec();

  console.log("🎯 Busca direta encontrou:", directMatches.length, "artigo(s)");

  // Busca Events por name ou sigla
  const EventModel = mongoose.model(COLLECTION_NAMES.EVENT);
  const events = await EventModel.find({
    $or: [{ name: { $regex: regex } }, { sigla: { $regex: regex } }],
  })
    .lean()
    .exec();

  // Extrai IDs dos eventos encontrados
  const eventIds = events.length > 0 ? events.map((e) => e._id) : [];
  console.log("🎯 Events encontrados:", eventIds.length, "evento(s)");

  // Busca Editions das events encontradas
  const EditionModel = mongoose.model(COLLECTION_NAMES.EDITION);
  let editions = [];

  try {
    if (eventIds.length > 0) {
      editions = await EditionModel.find({ event: { $in: eventIds } })
        .lean()
        .exec();
      console.log("📚 Editions encontrados:", editions.length, "edição(ões)");
    } else {
      console.log("📚 Nenhum evento encontrado, pulando busca de edições");
    }
  } catch (error) {
    console.error("❌ Erro ao buscar editions:", error.message);
    editions = [];
  }

  // Extrai IDs das edições encontradas
  const editionIds = editions.length > 0 ? editions.map((ed) => ed._id) : [];
  console.log("🔗 Edition IDs extraídos:", editionIds.length, "ID(s)");

  // Busca artigos dessas edições
  let indirectMatches = [];

  try {
    if (editionIds.length > 0) {
      indirectMatches = await ArticleModel.find({
        edition: { $in: editionIds },
      })
        .populate(populateOpts)
        .lean()
        .exec();
      console.log(
        "📄 Artigos indiretos encontrados:",
        indirectMatches.length,
        "artigo(s)"
      );
    } else {
      console.log(
        "📄 Nenhuma edição encontrada, pulando busca de artigos indiretos"
      );
    }
  } catch (error) {
    console.error("❌ Erro ao buscar artigos indiretos:", error.message);
    indirectMatches = [];
  }

  // Junta diretos + indiretos removendo duplicados por _id
  const map = new Map();
  directMatches.forEach((a) => map.set(String(a._id), a));
  indirectMatches.forEach((a) => map.set(String(a._id), a)); // sobrescreve apenas se não existir

  const allMatches = Array.from(map.values());
  console.log("✅ Total final de artigos únicos:", allMatches.length);

  // Ordena por title (ou outro campo se preferir)
  allMatches.sort((x, y) => {
    if (!x.title) return -1;
    if (!y.title) return 1;
    return x.title.localeCompare(y.title);
  });

  return allMatches;
}
