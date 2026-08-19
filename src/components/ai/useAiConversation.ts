import { useCallback, useRef, useState } from "react";
import { sendAiMessage } from "@/services/teacher/ai.service";
import type { AiChatResponse } from "@/models/ai.interface";

export type AiChatMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; response: AiChatResponse };

const createConversationId = () => crypto.randomUUID();

export function useAiConversation(context: Record<string, string> = {}) {
  const [conversationId, setConversationId] = useState(createConversationId);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [lastQuestion, setLastQuestion] = useState("");
  const conversationEpoch = useRef(0);

  const send = useCallback(async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || loading) return false;

    setMessages((items) => [...items, { id: crypto.randomUUID(), role: "user", text: question }]);
    setLastQuestion(question);
    setError(false);
    setLoading(true);
    const epoch = conversationEpoch.current;
    try {
      const response = await sendAiMessage({ message: question, conversationId, context });
      if (epoch === conversationEpoch.current) setMessages((items) => [...items, { id: crypto.randomUUID(), role: "assistant", text: response.message, response }]);
      return true;
    } catch {
      if (epoch === conversationEpoch.current) setError(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [context, conversationId, loading]);

  const newChat = useCallback(() => {
    conversationEpoch.current += 1;
    setConversationId(createConversationId());
    setMessages([]);
    setLastQuestion("");
    setError(false);
    setLoading(false);
  }, []);

  return { messages, loading, error, lastQuestion, send, newChat };
}
