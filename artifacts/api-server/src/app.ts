import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";
import fs from "node:fs";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve the built frontend (po-system) as static files.
const frontendDist = path.resolve(
  __dirname,
  "../po-system/dist",
);

logger.info({ __dirname, frontendDist, exists: fs.existsSync(frontendDist) }, "Frontend dist path");

app.use(express.static(frontendDist));

// SPA fallback: any route not matched by the API or a static file returns index.html
// so that client-side routing (wouter/react-router) works correctly.
app.use((_req: Request, res: Response, _next: NextFunction) => {
  const indexPath = path.join(frontendDist, "index.html");
  logger.info({ indexPath, exists: fs.existsSync(indexPath) }, "Serving SPA fallback");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Not found");
  }
});

export default app;

