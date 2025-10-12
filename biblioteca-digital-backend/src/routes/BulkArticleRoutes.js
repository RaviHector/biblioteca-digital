import { Router } from "express";
import * as BulkArticleController from "../controllers/BulkArticleController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";
import bulkUpload from "../middleware/bulkUpload.js";

const BulkArticleRoutes = Router();

// Rota para upload em massa de artigos via BibTeX + ZIP
BulkArticleRoutes.post(
  "/upload-bulk", 
  verifyJWT, 
  verifyAdmin, 
  bulkUpload.array('files', 2), // Máximo 2 arquivos
  BulkArticleController.bulkUploadArticles
);

export default BulkArticleRoutes;