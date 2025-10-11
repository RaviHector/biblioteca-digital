import { Router } from "express";
import UserRoutes from "./UsersRoutes.js";
import SessionRoutes from "./SessionsRoutes.js";
import EventRoutes from "./EventsRoutes.js";
const routes = Router();

routes
  .use("/", SessionRoutes)
  .use("/users", UserRoutes)
  .use("/events", EventRoutes);

export default routes;
