import { Router } from "express";
import UserRoutes from "./UsersRoutes.js";
import SessionRoutes from "./SessionsRoutes.js";
import EventsRoutes from "./EventsRoutes.js";
import EditionsRoutes from "./EditionsRoutes.js";
import ArticleRoutes from "./ArticleRoutes.js";
import BulkArticleRoutes from "./BulkArticleRoutes.js";
import EmailNotificationRoutes from "./EmailNotificationRoutes.js";
const routes = Router();

routes
  .use("/", SessionRoutes)
  .use("/users", UserRoutes)

  .use("/events", EventsRoutes)
  .use("/editions", EditionsRoutes)
  .use("/article", ArticleRoutes)
  .use("/bulk-articles", BulkArticleRoutes)
  .use("/email-notifications", EmailNotificationRoutes)

  .use("/events", EventsRoutes);
  //.use("/editions", EditionsRoutes);
  //.use("/articles", ArticleRoutes); 


export default routes;
