// Must be a module file (via export {}) for declare module to augment existing modules
export {};

declare module "express-session" {
  interface SessionData {
    userId: number;
    customerId: number;
  }
}
