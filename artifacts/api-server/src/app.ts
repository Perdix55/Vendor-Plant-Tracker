import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import path from "node:path";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

// connect-pg-simple expects the session module; cast needed due to TS overload mismatch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PgSession = ConnectPgSimple(session as any);
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

const app: Express = express();
app.set("trust proxy", 1);

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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    store: new PgSession({ pool: pgPool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET ?? "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api", router);

// Render runs API + frontend in one service. Replit serves the frontend separately,
// but serving the built assets here is harmless and keeps Render deploys working.
const frontendDist = path.resolve(__dirname, "../../po-system/dist/public");

if (fs.existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
  app.use((_req: Request, res: Response) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
