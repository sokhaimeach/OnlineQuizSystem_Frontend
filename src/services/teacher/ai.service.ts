import api from "@/lib/axios";
import type { AiChatPayload, AiChatResponse } from "@/models/ai.interface";

type AiSuccessEnvelope = { success: true; data: AiChatResponse };

export function resolveAiChatUrl(baseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL): string {
  if (baseUrl && /^https?:\/\//i.test(baseUrl)) return new URL("/api/ai/chat", baseUrl).toString();
  return "/api/ai/chat";
}

export async function sendAiMessage(payload: AiChatPayload) {
  // The shared interceptor already unwraps Axios' HTTP response to the backend
  // success envelope, so only the envelope's `data` field remains to unwrap.
  const response = await api.post<unknown, AiSuccessEnvelope>(resolveAiChatUrl(), payload);
  return response.data;
}
