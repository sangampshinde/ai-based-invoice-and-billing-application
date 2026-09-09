"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Users,
  Receipt,
  Wallet,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AILogo from "./AILogo";

const NAV = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/invoices", icon: FileText, label: "Invoices" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
  { to: "/payments", icon: Wallet, label: "Payments" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

const ROW_BASE =
  "relative flex items-center h-11 w-11 rounded-2xl overflow-hidden " +
  "group-hover/sidebar:w-[200px] " +
  "transition-[width,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

const LABEL_BASE =
  "text-sm font-medium whitespace-nowrap pr-4 " +
  "opacity-0 -translate-x-1 " +
  "transition-[opacity,transform] duration-200 ease-out " +
  "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100";

function NavItem({ to, icon: Icon, label, isActive }) {
  return (
    <Link href={to} title={label} className="block">
      <div
        className={cn(
          ROW_BASE,
          isActive
            ? "bg-[var(--ink)] text-[var(--bg)] shadow-card"
            : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
        )}
      >
        <span className="h-11 w-11 flex items-center justify-center shrink-0">
          <Icon size={18} strokeWidth={2} />
        </span>
        <span className={LABEL_BASE}>{label}</span>
      </div>
    </Link>
  );
}

export function Sidebar({ onOpenAgent }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const displayName = user?.name || "Account";
  const displayEmail = user?.email || "";

  return (
    <aside
      className={cn(
        "group/sidebar hidden md:flex shrink-0 h-[calc(100vh-32px)] sticky top-4 ml-4",
        "flex-col items-center justify-between py-5 rounded-3xl",
        "bg-[var(--surface)] border border-[var(--border)] shadow-card overflow-hidden z-30",
        "w-[88px] hover:w-[248px]",
        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      )}
    >
      <div className="flex flex-col items-center gap-6 w-full">
        <Link href="/dashboard" className="block">
          <div
            className={cn(
              "flex items-center h-14 w-14 group-hover/sidebar:w-[200px]",
              "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            )}
          >
            <div className="h-12 w-12 flex items-center justify-center shrink-0">
              <AILogo />
            </div>
            <span
              className={cn(
                "ml-2 font-display text-base font-semibold text-[var(--ink)] whitespace-nowrap",
                "opacity-0 -translate-x-1",
                "transition-[opacity,transform] duration-200 ease-out",
                "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100"
              )}
            >
              Invoicer
            </span>
          </div>
        </Link>

        <nav className="flex flex-col items-center gap-1.5">
          {NAV.map((item) => {
            const isActive =
              item.to === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.to);
            return <NavItem key={item.to} {...item} isActive={isActive} />;
          })}

          {/* Agentic Copilot Quick Nav Item */}
          {onOpenAgent && (
            <button
              type="button"
              onClick={onOpenAgent}
              title="Autonomous Copilot (Cmd+J)"
              className="block"
            >
              <div
                className={cn(
                  ROW_BASE,
                  "text-teal-600 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20"
                )}
              >
                <span className="h-11 w-11 flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </span>
                <span className={cn(LABEL_BASE, "font-semibold")}>AI Copilot (⌘J)</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <Link href="/settings" title="Settings" className="block">
          <div
            className={cn(
              ROW_BASE,
              pathname === "/settings"
                ? "bg-[var(--ink)] text-[var(--bg)] shadow-card"
                : "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            )}
          >
            <span className="h-11 w-11 flex items-center justify-center shrink-0">
              <Settings size={18} />
            </span>
            <span className={LABEL_BASE}>Settings</span>
          </div>
        </Link>

        <button onClick={logout} title="Log out" className="block">
          <div
            className={cn(
              ROW_BASE,
              "text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            )}
          >
            <span className="h-11 w-11 flex items-center justify-center shrink-0">
              <LogOut size={18} />
            </span>
            <span className={LABEL_BASE}>Log out</span>
          </div>
        </button>

        <div
          className={cn(
            "flex items-center h-12 mt-1 w-10 group-hover/sidebar:w-[200px] overflow-hidden",
            "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          )}
        >
          <div className="h-10 w-10 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] font-semibold flex items-center justify-center text-sm ring-2 ring-[var(--surface)] shrink-0">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div
            className={cn(
              "ml-3 min-w-0 flex-1",
              "opacity-0 -translate-x-1",
              "transition-[opacity,transform] duration-200 ease-out",
              "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100"
            )}
          >
            <div className="text-sm font-semibold text-[var(--ink)] truncate">
              {displayName}
            </div>
            {displayEmail && (
              <div className="text-[11px] text-[var(--ink-muted)] truncate">
                {displayEmail}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
