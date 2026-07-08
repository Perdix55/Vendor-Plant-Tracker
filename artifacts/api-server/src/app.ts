import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
// __dirname is injected at runtime via the banner in build.mjs.
const frontendDist = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../po-system/dist",
);
app.use(express.static(frontendDist));

// SPA fallback: any route not matched by the API or a static file returns index.html
// so that client-side routing (wouter/react-router) works correctly.
app.get("/:path*", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
