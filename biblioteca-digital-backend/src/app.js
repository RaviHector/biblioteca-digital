import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import corsOptions from "./config/cors.js";
import { NotFoundError } from "./errors/baseErrors.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";
import isDevEnvironment from "./utils/general/isDevEnvironment.js";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializando instância do servidor express

const app = express();
// Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(helmet());
if (isDevEnvironment) app.use(morgan("dev"));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use("/biblitoeca-digital-api", routes);

// Non existing routes
app.use(/.*/, (req, res, next) => {
  next(new NotFoundError(`Route '${req.baseUrl}' not found`));
});

export default app;
