import { Router } from "express";

import * as ArticleController from "../controllers/ArticleController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";

const ArticleRoutes = Router();

ArticleRoutes.route("/")
  .get(ArticleController.get)
  .post(verifyJWT, verifyAdmin, ArticleController.create);

ArticleRoutes.get("/search-by-name", ArticleController.searchByName);

ArticleRoutes.get("/search-article", ArticleController.searchArticle);

ArticleRoutes.route("/:_id")
  .get(ArticleController.getById)
  .put(verifyJWT, verifyAdmin, ArticleController.update)
  .delete(verifyJWT, verifyAdmin, ArticleController.destroy);

export default ArticleRoutes;