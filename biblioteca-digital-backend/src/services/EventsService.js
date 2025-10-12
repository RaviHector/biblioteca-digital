/**
 * Busca eventos por nome, sigla ou entidade.
 * @param {object} params - Os parâmetros da função.
 * @param {string} params.name - O termo a ser buscado nos campos name, sigla e entity.
 * @param {object} params.inputFilters - Filtros adicionais para a query do MongoDB.
 * @returns {Promise<Array>} Uma promessa que resolve para uma lista de eventos.
 */

import { Query } from "mongoose";
import { NotFoundError } from "../errors/baseErrors.js";
import EventsModel from "../models/EventsModel.js";
import EditionsModel from "../models/EditionsModel.js";
import ArticleModel from "../models/ArticleModel.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return (
    EventsModel.find(inputFilters)
      // .populate({    COMPOSICAO
      //   path: "products",
      //   select: "-__v",
      //   populate: [
      //     {
      //       path: "pictures",
      //       select: "name url",
      //     },
      //     {
      //       path: "documents",
      //       select: "name url",
      //     },
      //   ],
      // })
      .lean()
      .exec()
  );
}

export async function getById(_id) {
  const foundEvents = await EventsModel.findById(_id).lean().exec();
  if (!foundEvents) throw new NotFoundError("Events not found");
  return foundEvents;
}

export async function create(inputData) {
  const event = await EventsModel.create(inputData);
  return event.toObject();
}

export async function update({ _id, inputData }) {
  const foundEvents = await EventsModel.findById(_id).exec();
  if (!foundEvents) throw new NotFoundError("Events not found");

  return foundEvents.set(inputData).save();
}

export async function destroy(_id) {
  const foundEvents = await EventsModel.findById(_id).exec();
  if (!foundEvents) throw new NotFoundError("Events not found");

  // Buscar todas as edições relacionadas ao evento
  const relatedEditions = await EditionsModel.find({ event: _id }).select('_id').exec();
  const editionIds = relatedEditions.map(edition => edition._id);

  console.log(`Deletando evento ${_id}: encontradas ${relatedEditions.length} edições relacionadas`);

  // Deletar todos os artigos que pertencem às edições relacionadas
  if (editionIds.length > 0) {
    const deletedArticles = await ArticleModel.deleteMany({ edition: { $in: editionIds } });
    console.log(`Deletados ${deletedArticles.deletedCount} artigos relacionados às edições`);
  }

  // Deletar todas as edições relacionadas ao evento
  const deletedEditions = await EditionsModel.deleteMany({ event: _id });
  console.log(`Deletadas ${deletedEditions.deletedCount} edições do evento`);

  // Deletar o evento
  await foundEvents.deleteOne();
  console.log(`Evento ${_id} deletado com sucesso`);
}

export async function searchByName({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) query.name = { $regex: convertStringToRegexp(name) };

  return EventsModel.find(query).sort("name").lean().exec();
}

export async function searchEvents({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) {
    const regex = convertStringToRegexp(name);
    query.$or = [{ name: regex }, { sigla: regex }, { entity: regex }];
  }
  return EventsModel.find(query).sort("name").lean().exec();
}
