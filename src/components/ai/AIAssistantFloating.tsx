import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AIAssistantPanel } from "./AIAssistantPanel";
import { useAiConversation } from "./useAiConversation";

interface AIAssistantFloatingProps {
  context?: Record<string, string | undefined>;
  currentClassName?: string;
}

export function AIAssistantFloating({ context = {}, currentClassName }: AIAssistantFloatingProps) {
  const [open, setOpen] = useState(false);
  const safeContext = useMemo(() => Object.fromEntries(Object.entries(context).filter((entry): entry is [string, string] => Boolean(entry[1]))), [context]);
  const conversation = useAiConversation(safeContext);
  const { newChat } = conversation;
  const previousClassId = useRef(context.classId);

  useEffect(() => {
    if (previousClassId.current === context.classId) return;
    previousClassId.current = context.classId;
    newChat();
  }, [context.classId, newChat]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-foreground/15 backdrop-blur-[1px] md:hidden" aria-hidden="true" onClick={() => setOpen(false)} />}
      <div className="pointer-events-none fixed inset-0 z-40">
        {open && (
          <div role="dialog" aria-modal="true" aria-label="AI Assistant" className="pointer-events-auto absolute inset-0 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 md:inset-auto md:bottom-6 md:right-6 md:h-[min(620px,calc(100vh-48px))] md:w-[400px] md:rounded-2xl md:border md:shadow-2xl">
            <AIAssistantPanel {...conversation} onSend={conversation.send} onNewChat={conversation.newChat} onClose={() => setOpen(false)} autoFocus className="h-full md:rounded-2xl" currentClassName={currentClassName} />
          </div>
        )}
        {!open && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" className="pointer-events-auto absolute bottom-5 right-4 size-14 rounded-full shadow-lg transition-transform hover:scale-[1.03] active:scale-95 sm:bottom-6 sm:right-6" onClick={() => setOpen(true)} aria-label="Open AI Assistant">
                <Bot className="size-5" />
                <Sparkles className="absolute right-2 top-2 size-2.5 text-primary-foreground/80" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>AI Assistant</TooltipContent>
          </Tooltip>
        )}
      </div>
    </>
  );
}
