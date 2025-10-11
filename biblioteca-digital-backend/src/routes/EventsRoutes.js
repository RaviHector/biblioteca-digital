import { Router } from "express";

import * as EventsController from "../controllers/EventsController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";

const EventsRoutes = Router();

EventsRoutes.route("/")
  .get(EventsController.get)
  .post(verifyJWT, verifyAdmin, EventsController.create);

EventsRoutes.get("/search-by-name", EventsController.searchByName);

EventsRoutes.route("/:_id")
  .get(EventsController.getById)
  .put(verifyJWT, verifyAdmin, EventsController.update)
  .delete(verifyJWT, verifyAdmin, EventsController.destroy);

export default EventsRoutes;
