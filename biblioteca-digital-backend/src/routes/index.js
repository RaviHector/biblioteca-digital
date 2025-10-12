import { Router } from "express";
import UserRoutes from "./UsersRoutes.js";
import SessionRoutes from "./SessionsRoutes.js";
import EventsRoutes from "./EventsRoutes.js";
import EditionsRoutes from "./EditionsRoutes.js";
import ArticleRoutes from "./ArticleRoutes.js";
const routes = Router();

routes
  .use("/", SessionRoutes)
  .use("/users", UserRoutes)
  .use("/events", EventsRoutes)
  .use("/editions", EditionsRoutes)
  .use("/article", ArticleRoutes);

export default routes;
