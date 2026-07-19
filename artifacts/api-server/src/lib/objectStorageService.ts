import {
  LocalObjectStorageService,
  isLocalObjectStorage,
  type LocalStoredFile,
} from "./localObjectStorage";
import {
  ObjectStorageService,
  ObjectNotFoundError,
} from "./objectStorage";
import type { File } from "@google-cloud/storage";

export { ObjectNotFoundError };

type StoredFile = File | LocalStoredFile;

export function createObjectStorageService():
  | ObjectStorageService
  | LocalObjectStorageService {
  return isLocalObjectStorage()
    ? new LocalObjectStorageService()
    : new ObjectStorageService();
}

export async function downloadStoredObject(
  service: ObjectStorageService | LocalObjectStorageService,
  file: StoredFile,
  cacheTtlSec = 3600,
): Promise<Response> {
  if ("kind" in file && file.kind === "local") {
    return (service as LocalObjectStorageService).downloadObject(file, cacheTtlSec);
  }
  return (service as ObjectStorageService).downloadObject(file as File, cacheTtlSec);
}
