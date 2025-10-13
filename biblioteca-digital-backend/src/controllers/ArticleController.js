import * as ArticleService from "../services/ArticleService.js";
import asyncHandler from "../utils/general/asyncHandler.js";
import { SUCCESS_CODES } from "../utils/general/constants.js";
import * as ArticleValidator from "../validators/ArticleValidator.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Se um arquivo foi enviado, adicionar o caminho ao inputData
  if (req.file) {
    inputData.pdf_file = `/uploads/articles/${req.file.filename}`;
  }
  
  const newArticle = await ArticleService.create(inputData);

  res.status(SUCCESS_CODES.CREATED).json(newArticle);
});

export const update = asyncHandler(async (req, res) => {
  const { _id, ...inputData } = ArticleValidator.update(req);
  
  // Se um novo arquivo foi enviado, adicionar o caminho ao inputData
  if (req.file) {
    inputData.pdf_file = `/uploads/articles/${req.file.filename}`;
  }
  
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

export const downloadPdf = asyncHandler(async (req, res) => {
  const { _id } = ArticleValidator.getById(req);
  const article = await ArticleService.getById(_id);

  if (!article.pdf_file) {
    return res.status(404).json({ error: "PDF não disponível para este artigo" });
  }

  // Construir o caminho completo do arquivo
  const filePath = path.join(__dirname, '../../', article.pdf_file);
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Arquivo PDF não encontrado" });
  }

  // Definir o nome do arquivo para download
  const fileName = `${article.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  // Configurar headers para download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  // Enviar o arquivo
  res.sendFile(filePath);
});
