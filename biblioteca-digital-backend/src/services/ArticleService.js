import mongoose from "mongoose";
import { NotFoundError } from "../errors/baseErrors.js";
import ArticleModel from "../models/ArticleModel.js";
import EditionsModel from "../models/EditionsModel.js";
import EmailNotificationModel from "../models/EmailNotificationModel.js";
import { COLLECTION_NAMES } from "../utils/general/constants.js";
import convertStringToRegexp from "../utils/general/convertStringToRegexp.js";
import { sendArticleNotificationEmail } from "../utils/libs/emailService.js";

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
  const newArticle = await ArticleModel.create(inputData);
  
  // Buscar o artigo criado com dados populados para notificações
  const populatedArticle = await ArticleModel.findById(newArticle._id)
    .populate({
      path: "edition",
      populate: {
        path: "event"
      }
    })
    .lean()
    .exec();
  
  // Enviar notificações por email para autores cadastrados
  if (populatedArticle && Array.isArray(populatedArticle.author)) {
    try {
      for (const authorName of populatedArticle.author) {
        // Buscar emails cadastrados para este autor
        const notifications = await EmailNotificationModel.find({
          name: { $regex: new RegExp(`^${authorName.trim()}$`, 'i') },
          isActive: true
        }).lean().exec();
        
        // Enviar email para cada inscrição encontrada
        for (const notification of notifications) {
          try {
            await sendArticleNotificationEmail({
              email: notification.email,
              authorName: authorName,
              articleTitle: populatedArticle.title,
              eventName: populatedArticle.edition?.event?.name || 'Evento não informado',
              editionYear: populatedArticle.edition?.year || 'Ano não informado'
            });
            
            console.log(`✅ Email enviado para ${notification.email} sobre artigo do autor ${authorName}`);
          } catch (emailError) {
            console.error(`❌ Erro ao enviar email para ${notification.email}:`, emailError);
          }
        }
      }
    } catch (notificationError) {
      console.error("Erro ao processar notificações:", notificationError);
      // Não falhar a criação do artigo por erro de notificação
    }
  }
  
  return newArticle;
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
