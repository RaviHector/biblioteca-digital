import { NotFoundError } from "../errors/baseErrors.js";
import EditionsModel from "../models/EditionsModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return EditionsModel.find(inputFilters)
    .populate(COLLECTION_NAMES.EVENT)
    .lean()
    .exec();
}

export async function getById(_id) {
  const foundEditions = await EditionsModel.findById(_id)
    .populate(COLLECTION_NAMES.EVENT)
    .lean()
    .exec();
  if (!foundEditions) throw new NotFoundError("Edition not found");
  return foundEditions;
}

export async function create(inputData) {
  return EditionsModel.create(inputData);
}

export async function update({ _id, inputData }) {
  const foundEditions = await EditionsModel.findById(_id).exec();
  if (!foundEditions) throw new NotFoundError("Edition not found");

  return foundEditions.set(inputData).save();
}

export async function destroy(_id) {
  const foundEditions = await EditionsModel.findById(_id).exec();
  if (!foundEditions) throw new NotFoundError("Edition not found");

  await foundEditions.deleteOne();
}

export async function searchByName({ name, inputFilters }) {
  const query = { ...inputFilters };
  if (name) query.name = { $regex: convertStringToRegexp(name) };

  return EditionsModel.find(query)
    .populate(COLLECTION_NAMES.EVENT)
    .sort("name")
    .lean()
    .exec();
}

export async function searchEditions({ searchTerm, inputFilters }) {
    const query = { ...inputFilters };
    if (searchTerm) {
    const regex = convertStringToRegexp(searchTerm); 
      query.$or = [
      { year: regex },
      { place: regex },
      { event: regex },
    ];
  }
  return EditionsModel.find(query).sort("name").lean().exec();
}
