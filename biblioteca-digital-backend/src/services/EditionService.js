import { NotFoundError } from "../errors/baseErrors.js";
import EditionModel from "../models/EditionModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return EditionModel.find(inputFilters)
    .populate(COLLECTION_NAMES.EVENT)
    .lean()
    .exec();
}

export async function getById(_id) {
  const foundEdition = await EditionModel.findById(_id)
    .populate(COLLECTION_NAMES.EVENT)
    .lean()
    .exec();
  if (!foundEdition) throw new NotFoundError("Edition not found");
  return foundEdition;
}

export async function create(inputData) {
  return EditionModel.create(inputData);
}

export async function update({ _id, inputData }) {
  const foundEdition = await EditionModel.findById(_id).exec();
  if (!foundEdition) throw new NotFoundError("Edition not found");

  return foundEdition.set(inputData).save();
}

export async function destroy(_id) {
  const foundEdition = await EditionModel.findById(_id).exec();
  if (!foundEdition) throw new NotFoundError("Edition not found");

  await foundEdition.deleteOne();
}

export async function searchByName({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) query.name = { $regex: convertStringToRegexp(name) };

  return EditionModel.find(query)
    .populate(COLLECTION_NAMES.EVENT)
    .sort("name")
    .lean()
    .exec();
}
