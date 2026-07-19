import { Router, type IRouter, type Request, type Response } from "express";
import express from "express";
import { Readable } from "stream";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import {
  createObjectStorageService,
  downloadStoredObject,
  ObjectNotFoundError,
} from "../lib/objectStorageService";
import {
  isLocalObjectStorage,
  LocalObjectStorageService,
} from "../lib/localObjectStorage";

const router: IRouter = Router();
const objectStorageService = createObjectStorageService();

router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;

    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.put(
  "/storage/uploads/put/:objectId",
  express.raw({ type: "*/*", limit: "10mb" }),
  async (req: Request, res: Response) => {
    if (!isLocalObjectStorage() || !(objectStorageService instanceof LocalObjectStorageService)) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const objectId = req.params.objectId;
    if (!objectId || Array.isArray(objectId)) {
      res.status(400).json({ error: "Invalid object id" });
      return;
    }

    const body = req.body;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      res.status(400).json({ error: "Empty upload body" });
      return;
    }

    try {
      const contentType = typeof req.headers["content-type"] === "string"
        ? req.headers["content-type"]
        : undefined;
      const objectPath = objectStorageService.saveUploadedObject(objectId, body, contentType);
      res.status(200).json({ objectPath });
    } catch (error) {
      req.log.error({ err: error }, "Error saving uploaded object");
      res.status(500).json({ error: "Failed to save upload" });
    }
  },
);

router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await downloadStoredObject(objectStorageService, file);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

    const response = await downloadStoredObject(objectStorageService, objectFile);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
