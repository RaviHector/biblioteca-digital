import { NotFoundError } from "../errors/baseErrors.js";
import EditionsModel from "../models/EditionsModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";

export async function get(inputFilters) {
  return EditionsModel.find(inputFilters)
    .populate("event")
    .lean()
    .exec();
}

export async function getById(_id) {
  const foundEditions = await EditionsModel.findById(_id)
    .populate("event")
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
    .populate("event")
    .sort("name")
    .lean()
    .exec();
}

export async function searchEditions({ name, inputFilters = {} }) {
  if (!name) {
    return EditionsModel.find(inputFilters)
      .populate("event")
      .sort("year")
      .lean()
      .exec();
  }
  const regex = convertStringToRegexp(name);
  const pipeline = [
    {
      $lookup: {
        from: COLLECTION_NAMES.EVENT,
        localField: "event",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },

    {
      $match: {
        $or: [
          { year: { $regex: regex } },
          { place: { $regex: regex } },
          { "event.name": { $regex: regex } },
          { "event.sigla": { $regex: regex } },
        ],
        ...inputFilters,
      },
    },
    { $sort: { year: 1 } },
  ];
  const results = await EditionsModel.aggregate(pipeline);
  return results;
}
