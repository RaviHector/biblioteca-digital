import { Router } from "express";

import * as EditionsController from "../controllers/EditionsController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";

const EditionsRoutes = Router();

EditionsRoutes.route("/")
  .get(EditionsController.get)
  .post(verifyJWT, verifyAdmin, EditionsController.create);

EditionsRoutes.get("/search-by-name", EditionsController.searchByName);

EditionsRoutes.get("/search-editions", EditionsController.searchEditions);

EditionsRoutes.route("/:_id")
  .get(EditionsController.getById)
  .put(verifyJWT, verifyAdmin, EditionsController.update)
  .delete(verifyJWT, verifyAdmin, EditionsController.destroy);

export default EditionsRoutes;
