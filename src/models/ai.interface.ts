export interface AiChatResponse {
  message: string;
  intent: string;
  results: Record<string, unknown> | unknown[];
  context: Record<string, unknown>;
  model: string;
  source: "qwen-v6" | "fallback";
}

export interface AiChatPayload {
  message: string;
  conversationId: string;
  context?: Record<string, string>;
}
