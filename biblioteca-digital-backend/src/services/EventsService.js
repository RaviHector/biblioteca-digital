/**
 * Busca eventos por nome, sigla ou entidade.
 * @param {object} params - Os parâmetros da função.
 * @param {string} params.searchTerm - O termo a ser buscado nos campos name, sigla e entity.
 * @param {object} params.inputFilters - Filtros adicionais para a query do MongoDB.
 * @returns {Promise<Array>} Uma promessa que resolve para uma lista de eventos.
 */


import { Query } from "mongoose";
import { NotFoundError } from "../errors/baseErrors.js";
import EventsModel from "../models/EventsModel.js";
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
  return EventsModel.create(inputData);
}

export async function update({ _id, inputData }) {
  const foundEvents = await EventsModel.findById(_id).exec();
  if (!foundEvents) throw new NotFoundError("Events not found");

  return foundEvents.set(inputData).save();
}

export async function destroy(_id) {
  const foundEvents = await EventsModel.findById(_id).exec();
  if (!foundEvents) throw new NotFoundError("Events not found");

  await foundEvents.deleteOne();
}

export async function searchByName({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) query.name = { $regex: convertStringToRegexp(name) };

  return EventsModel.find(query).sort("name").lean().exec();
}

export async function searchEvents({ searchTerm, inputFilters }) {
  // Inicia a query com os filtros base
  const query = { ...inputFilters };

  // Se um termo de busca for fornecido, adiciona a lógica de busca multicampo
  if (searchTerm) {
    const regex = convertStringToRegexp(searchTerm); 

    // Usa o operador $or para buscar o termo em qualquer um dos três campos
    query.$or = [
      { name: regex },
      { sigla: regex },
      { entity: regex },
    ];
  }

  

  return EventsModel.find(query).sort("name").lean().exec();
}
