import { Router } from "express";
import * as EmailNotificationController from "../controllers/EmailNotificationController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = Router();

// Rota pública para se inscrever nas notificações
router.post("/subscribe", EmailNotificationController.subscribe);

// Rota pública para se desinscrever
router.delete("/unsubscribe", EmailNotificationController.unsubscribe);

// Rotas protegidas para admins gerenciarem as notificações
router.get("/", verifyJWT, verifyAdmin, EmailNotificationController.getAll);
router.get("/by-name", verifyJWT, verifyAdmin, EmailNotificationController.getByName);
router.patch("/:id/toggle", verifyJWT, verifyAdmin, EmailNotificationController.toggleActive);

export default router;