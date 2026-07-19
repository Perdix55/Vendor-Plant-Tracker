import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { getPublicAppOrigin } from "./app-url";
import { ObjectNotFoundError } from "./objectStorage";

export type LocalStoredFile = {
  kind: "local";
  absolutePath: string;
  contentType: string;
};

export function isLocalObjectStorage(): boolean {
  return !process.env.PRIVATE_OBJECT_DIR?.trim();
}

export function getLocalObjectStorageRoot(): string {
  return process.env.LOCAL_OBJECT_DIR?.trim() || path.join(process.cwd(), "data/object-storage");
}

function ensureUploadsDir(): string {
  const uploadsDir = path.join(getLocalObjectStorageRoot(), "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  return uploadsDir;
}

function readStoredContentType(absolutePath: string): string {
  const metaPath = `${absolutePath}.meta`;
  if (fs.existsSync(metaPath)) {
    return fs.readFileSync(metaPath, "utf8").trim() || "application/octet-stream";
  }

  const ext = path.extname(absolutePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".webp") return "image/webp";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

function resolveLocalFile(objectPath: string): LocalStoredFile {
  if (!objectPath.startsWith("/objects/")) {
    throw new ObjectNotFoundError();
  }

  const relativePath = objectPath.slice("/objects/".length);
  const absolutePath = path.join(getLocalObjectStorageRoot(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new ObjectNotFoundError();
  }

  return {
    kind: "local",
    absolutePath,
    contentType: readStoredContentType(absolutePath),
  };
}

export class LocalObjectStorageService {
  async getObjectEntityUploadURL(): Promise<string> {
    ensureUploadsDir();
    const objectId = randomUUID();
    const origin = getPublicAppOrigin().replace(/\/$/, "");
    return `${origin}/api/storage/uploads/put/${objectId}`;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    const putMatch = rawPath.match(/\/uploads\/put\/([^/?#]+)/);
    if (putMatch) {
      return `/objects/uploads/${putMatch[1]}`;
    }
    return rawPath;
  }

  async getObjectEntityFile(objectPath: string): Promise<LocalStoredFile> {
    return resolveLocalFile(objectPath);
  }

  async searchPublicObject(_filePath: string): Promise<LocalStoredFile | null> {
    return null;
  }

  async downloadObject(file: LocalStoredFile, cacheTtlSec = 3600): Promise<Response> {
    const nodeStream = fs.createReadStream(file.absolutePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;
    const stat = fs.statSync(file.absolutePath);

    return new Response(webStream, {
      headers: {
        "Content-Type": file.contentType,
        "Content-Length": String(stat.size),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      },
    });
  }

  saveUploadedObject(objectId: string, buffer: Buffer, contentType?: string): string {
    const uploadsDir = ensureUploadsDir();
    const absolutePath = path.join(uploadsDir, objectId);
    fs.writeFileSync(absolutePath, buffer);
    if (contentType) {
      fs.writeFileSync(`${absolutePath}.meta`, contentType);
    }
    return `/objects/uploads/${objectId}`;
  }
}
