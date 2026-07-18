import OpenAI from "openai";

let client: OpenAI | undefined;

function resolveOpenAIConfig(): { apiKey: string; baseURL: string } {
  const apiKey =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  const baseURL =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error(
      "OpenAI is not configured. Set AI_INTEGRATIONS_OPENAI_API_KEY (Replit) or OPENAI_API_KEY.",
    );
  }

  return { apiKey, baseURL };
}

export function getOpenAI(): OpenAI {
  if (!client) {
    const { apiKey, baseURL } = resolveOpenAIConfig();
    client = new OpenAI({ apiKey, baseURL });
  }
  return client;
}

/** Lazy OpenAI client — does not require env vars until first use. */
export const openai: OpenAI = new Proxy({} as OpenAI, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getOpenAI(), prop, receiver);
    return typeof value === "function" ? value.bind(getOpenAI()) : value;
  },
});
