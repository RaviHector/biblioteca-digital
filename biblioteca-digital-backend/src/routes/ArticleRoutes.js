import { Router } from "express";

import * as ArticleController from "../controllers/ArticleController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";
import upload from "../middleware/fileUpload.js";

const ArticleRoutes = Router();

ArticleRoutes.route("/")
  .get(ArticleController.get)
  .post(verifyJWT, verifyAdmin, upload.single('pdf_file'), ArticleController.create);

ArticleRoutes.get("/search-by-name", ArticleController.searchByName);

ArticleRoutes.get("/search-article", ArticleController.searchArticle);

ArticleRoutes.get("/:_id/download", ArticleController.downloadPdf);

ArticleRoutes.route("/:_id")
  .get(ArticleController.getById)
  .put(verifyJWT, verifyAdmin, upload.single('pdf_file'), ArticleController.update)
  .delete(verifyJWT, verifyAdmin, ArticleController.destroy);

export default ArticleRoutes;