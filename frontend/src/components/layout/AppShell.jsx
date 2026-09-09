"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { AgentCopilotSheet } from "@/components/agent/AgentCopilotSheet";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  const openAgent = useCallback(() => setAgentOpen(true), []);
  const closeAgent = useCallback(() => setAgentOpen(false), []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setPaletteOpen(false);
  }, [pathname]);

  // Keyboard Shortcuts: Cmd+K (Search), Cmd+J (AI Copilot)
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        setAgentOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--ink-muted)] text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span>Loading Invoicer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <Sidebar onOpenAgent={openAgent} />
      <main className="flex-1 px-6 md:px-8 py-6 max-w-[1600px] mx-auto w-full">
        <Topbar onOpenPalette={openPalette} onOpenAgent={openAgent} />
        {children}
      </main>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
      <AgentCopilotSheet open={agentOpen} onOpenChange={setAgentOpen} />
    </div>
  );
}
export default AppShell;
