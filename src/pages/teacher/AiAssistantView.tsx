import { AIAssistantPanel } from "@/components/ai/AIAssistantPanel";
import { useAiConversation } from "@/components/ai/useAiConversation";

// Retained for direct bookmarks/internal links. The normal teacher experience
// uses the floating assistant mounted once in TeacherDashboard.
export function AiAssistantView() {
  const conversation = useAiConversation();
  return (
    <div className="mx-auto h-[calc(100svh-8.5rem)] min-h-[520px] max-w-3xl overflow-hidden rounded-2xl border bg-card shadow-sm">
      <AIAssistantPanel {...conversation} onSend={conversation.send} onNewChat={conversation.newChat} className="h-full" autoFocus />
    </div>
  );
}
