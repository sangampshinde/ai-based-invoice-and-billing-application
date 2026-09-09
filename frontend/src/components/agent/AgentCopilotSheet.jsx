"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

import { aiApi } from "@/api/ai";
import {
  Bot,
  Send,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Loader2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function AgentCopilotSheet({ open, onOpenChange }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi Alex! I'm your Autonomous Financial Copilot. I can audit accounts receivable, identify overdue invoices, draft reminders, and inspect your financial health in real time. How can I assist you today?",
      steps: [],
      actions: [
        { label: "Audit Overdue Invoices", prompt: "Audit overdue invoices and draft reminders" },
        { label: "Review Financial Health", prompt: "What is our financial health and cashflow?" },
        { label: "Top Clients", prompt: "Who are our top clients by billing?" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiApi.agentChat(text, history);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          steps: res.steps || [],
          actions: res.actions || [],
        },
      ]);
    } catch (err) {
      toast.error(err.message || "Agent request failed");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection issue. You can try asking again or select one of the suggested actions below.",
          steps: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (action) => {
    if (action.prompt) {
      handleSend(action.prompt);
    } else if (action.action === "dispatch_reminder") {
      toast.success(`Payment reminder queued for ${action.payload?.to || "client"}!`);
    } else if (action.action === "query_overdue") {
      handleSend("Audit all overdue invoices and draft followups");
    } else if (action.action === "query_health") {
      handleSend("Give me a financial health check");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col h-full sm:max-w-xl p-0 border-l border-border bg-surface text-ink"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-border/80 bg-surface-2/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base font-semibold">
                  Autonomous Financial Copilot
                </SheetTitle>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-accent border-accent/40 bg-accent-soft">
                  ReAct Agent
                </Badge>
              </div>
              <SheetDescription className="text-xs text-ink-muted">
                Multi-tool calling • Live database execution • Cashflow reasoning
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {m.role === "user" ? (
                <div className="rounded-2xl rounded-tr-sm bg-accent text-white px-4 py-2.5 max-w-[85%] text-sm shadow-sm">
                  {m.content}
                </div>
              ) : (
                <div className="space-y-3 max-w-[95%]">
                  {/* Reasoning & Tool Steps Accordion */}
                  {m.steps && m.steps.length > 0 && (
                    <div className="rounded-xl border border-border/70 bg-surface-2/60 p-3 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-ink-muted">
                        <Terminal className="h-3.5 w-3.5 text-accent" />
                        <span>Agent Execution Trace</span>
                      </div>
                      <div className="space-y-2 pl-2 border-l-2 border-accent/40">
                        {m.steps.map((s, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            {s.type === "thought" && (
                              <p className="text-ink/80 italic">
                                💭 <span className="font-medium text-ink-muted">Thought:</span> {s.content}
                              </p>
                            )}
                            {s.type === "tool_call" && (
                              <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent-strong bg-accent-soft/60 px-2 py-1 rounded">
                                <Wand2 className="h-3 w-3" />
                                <span>Tool Call: {s.tool}({JSON.stringify(s.args || {})})</span>
                              </div>
                            )}
                            {s.type === "tool_result" && (
                              <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Result: {s.output}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Main Response Message */}
                  <div className="rounded-2xl rounded-tl-sm bg-surface-2/90 border border-border/80 px-4 py-3 text-sm text-ink leading-relaxed">
                    {m.content}
                  </div>

                  {/* Quick Action Chips */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.actions.map((act, aIdx) =>
                        act.url ? (
                          <Link
                            key={aIdx}
                            href={act.url}
                            onClick={() => onOpenChange(false)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-surface border border-accent/30 text-accent hover:bg-accent-soft px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            <span>{act.label}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <button
                            key={aIdx}
                            type="button"
                            onClick={() => handleAction(act)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-surface border border-border hover:border-accent text-ink hover:text-accent px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            <Sparkles className="h-3 w-3 text-accent" />
                            <span>{act.label}</span>
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-ink-muted bg-surface-2/60 border border-border/50 px-3.5 py-2.5 rounded-xl w-fit">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
              <span>Agent reasoning & executing database tools...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border/80 bg-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Agent (e.g. 'Audit overdue invoices', 'Check revenue health')..."
              className="flex-1 bg-surface-2 text-sm"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
              className="rounded-xl h-10 w-10 shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default AgentCopilotSheet;
