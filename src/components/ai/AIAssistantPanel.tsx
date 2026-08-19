import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { BarChart3, Bot, Loader2, MessageCircleQuestion, Plus, RotateCcw, Send, Sparkles, Target, TrendingDown, User, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AiChatMessage } from "./useAiConversation";

interface AIAssistantPanelProps {
  messages: AiChatMessage[];
  loading: boolean;
  error: boolean;
  lastQuestion: string;
  onSend: (question: string) => Promise<boolean>;
  onNewChat: () => void;
  onClose?: () => void;
  className?: string;
  autoFocus?: boolean;
  currentClassName?: string;
}

export function AIAssistantPanel({ messages, loading, error, lastQuestion, onSend, onNewChat, onClose, className, autoFocus = false, currentClassName }: AIAssistantPanelProps) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const debug = import.meta.env.VITE_AI_DEBUG === "true";
  const activeClassName = currentClassName?.trim();
  const suggestions = [
    { label: "Class overview", prompt: "How is my class doing overall?", icon: BarChart3 },
    ...(activeClassName ? [{ label: "Class size", prompt: `How many students are in Class ${activeClassName}?`, icon: Users }] : []),
    { label: "Weakest subject", prompt: "What is the lowest-average subject in my current class?", icon: TrendingDown },
    { label: "Who to review tomorrow", prompt: "Which students should I review with tomorrow?", icon: Target },
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, error]);

  useEffect(() => {
    if (autoFocus) window.setTimeout(() => inputRef.current?.focus(), 100);
  }, [autoFocus]);

  async function submit(question: string) {
    const value = question.trim();
    if (!value || loading) return;
    setInput("");
    await onSend(value);
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit(input);
    }
  };

  return (
    <section className={cn("flex min-h-0 flex-col overflow-hidden bg-card text-card-foreground", className)} aria-label="AI Assistant conversation">
      <header className="flex shrink-0 items-center gap-3 border-b bg-card px-4 py-3.5">
        <div className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Bot className="size-5" />
          <Sparkles className="absolute -right-1 -top-1 size-3.5 rounded-full bg-card p-0.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold tracking-tight">AI Assistant</h2>
          <p className="truncate text-xs text-muted-foreground">Teaching analytics assistant</p>
        </div>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-1.5 px-2 text-xs text-muted-foreground" onClick={onNewChat} aria-label="Start a new AI chat">
          <Plus className="size-3.5" /> New chat
        </Button>
        {onClose && <Button type="button" variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Close AI Assistant"><X className="size-4" /></Button>}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite" aria-busy={loading}>
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col justify-center py-6">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl border bg-muted/50 text-primary"><MessageCircleQuestion className="size-5" /></div>
            <h3 className="mt-4 text-center text-base font-semibold tracking-tight">Hi! How can I help with your class today?</h3>
            <p className="mx-auto mt-1 max-w-72 text-center text-xs leading-5 text-muted-foreground">Ask about student progress, class patterns, or what to review next.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return <button key={suggestion.label} type="button" disabled={loading} className="flex min-h-11 items-center gap-2.5 rounded-xl border bg-background px-3 py-2.5 text-left text-xs font-medium leading-4 transition-colors hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" onClick={() => void submit(suggestion.prompt)}><Icon className="size-4 shrink-0 text-primary" />{suggestion.label}</button>;
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => message.role === "user" ? (
              <div key={message.id} className="flex justify-end gap-2.5">
                <div className="max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm leading-5 text-primary-foreground">{message.text}</div>
                <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><User className="size-3.5" /></div>
              </div>
            ) : (
              <div key={message.id} className="flex items-start gap-2.5">
                <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Bot className="size-3.5" /></div>
                <div className="max-w-[88%] rounded-2xl rounded-bl-md border bg-background px-3.5 py-2.5 shadow-xs">
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                  {debug && <p className="mt-2 border-t pt-2 text-[10px] text-muted-foreground">{message.response.intent} · {message.response.source}</p>}
                </div>
              </div>
            ))}
            {loading && <div className="flex items-center gap-2.5 text-xs text-muted-foreground"><div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary"><Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" /></div><span>AI Assistant is thinking…</span></div>}
            {error && <div className="ml-9 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-xs text-destructive"><p>I couldn't get an answer right now. Please try again.</p>{lastQuestion && <Button type="button" variant="ghost" size="sm" className="mt-1 h-7 gap-1.5 px-1.5 text-destructive hover:text-destructive" onClick={() => void submit(lastQuestion)}><RotateCcw className="size-3" /> Retry</Button>}</div>}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 border-t bg-card p-3">
        <label htmlFor="ai-assistant-input" className="sr-only">Ask about your students or class</label>
        <div className="flex items-end gap-2 rounded-2xl border bg-background p-1.5 shadow-xs focus-within:ring-2 focus-within:ring-ring/40">
          <Textarea ref={inputRef} id="ai-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about your students or class…" maxLength={2000} rows={1} className="max-h-28 min-h-10 resize-none border-0 bg-transparent px-2.5 py-2 text-sm shadow-none focus-visible:ring-0" />
          <Button type="submit" size="icon" className="size-10 shrink-0 rounded-xl" disabled={!input.trim() || loading} aria-label="Send message"><Send className="size-4" /></Button>
        </div>
        <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">Enter to send · Shift+Enter for a new line</p>
      </form>
    </section>
  );
}
