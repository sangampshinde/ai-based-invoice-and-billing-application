"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ScanLine,
  Sparkles,
  BellRing,
  PenLine,
  FileText,
  Users,
  BarChart3,
  ShieldCheck,
  Wallet,
  Receipt,
  CheckCircle2,
  TrendingUp,
  Check,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AILogo from "@/components/layout/AILogo";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";

export default function Landing() {
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "light");
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0c1a17] overflow-x-clip antialiased">
      <Nav />
      <Hero />
      <Marquee />
      <AISection />
      <CoreSection />
      <CTASection />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── Nav ─────────────────────────── */
function Nav() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 border-b border-black/[0.05]">
      <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <AILogo />
          <span className="font-display font-semibold text-lg">Invoicer</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="h-10 px-4 rounded-full text-sm font-semibold hover:bg-black/[0.04] flex items-center transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="group h-10 px-5 rounded-full text-sm font-semibold text-white flex items-center gap-1.5 shadow-[0_8px_24px_-8px_rgba(13,148,136,0.6)] hover:shadow-[0_12px_30px_-8px_rgba(13,148,136,0.75)] transition-all"
            style={{
              background:
                "linear-gradient(135deg,#14b8a6,#0d9488 50%,#0f766e)",
            }}
          >
            Get started{" "}
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glows */}
      <div
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.22), transparent 70%)",
        }}
      />
      <div
        className="absolute top-20 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1.35fr] gap-10 items-center pt-16 lg:pt-24 pb-16">
        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-black/[0.05] text-[#0f766e] text-xs font-semibold shadow-sm">
            <Sparkles size={13} /> Autonomous Financial AI & Invoicing
          </span>
          <h1 className="font-display text-[clamp(40px,6.4vw,68px)] font-semibold leading-[0.98] tracking-tight mt-6">
            Invoicing that
            <br />
            <span
              style={{
                background:
                  "linear-gradient(120deg,#0f766e,#14b8a6 55%,#2dd4bf)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              runs itself.
            </span>
          </h1>
          <p className="text-lg text-[#4a5f5a] mt-6 max-w-lg leading-relaxed">
            Create beautiful invoices, track payments with PostgreSQL & Redis, and let our
            Autonomous Agent scan receipts, draft reminders, and manage your cashflow.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <Link
              href="/register"
              className="group h-12 px-7 rounded-full text-sm font-semibold text-white flex items-center gap-2 shadow-[0_12px_30px_-8px_rgba(13,148,136,0.65)] hover:shadow-[0_16px_38px_-8px_rgba(13,148,136,0.8)] transition-all"
              style={{
                background:
                  "linear-gradient(135deg,#14b8a6,#0d9488 50%,#0f766e)",
              }}
            >
              Start free{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="/login"
              className="h-12 px-6 rounded-full text-sm font-semibold border border-black/10 bg-white hover:bg-black/[0.03] flex items-center transition-colors"
            >
              Sign in
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8">
            {[
              "NestJS + TypeORM",
              "Next.js App Router",
              "Agentic AI Copilot",
              "Redis Cache",
            ].map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4a5f5a]"
              >
                <Check size={14} className="text-[#0d9488]" /> {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right — scrolling invoice wall */}
        <div className="hidden lg:block">
          <InvoiceWall />
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Scrolling invoice wall (Pinterest-style) ───────────────── */
function InvoiceWall() {
  const colA = [
    <InvoiceCard key="a1" />,
    <RevenueCard key="a2" />,
    <PaymentCard key="a3" />,
  ];
  const colB = [
    <ReceiptCard key="b1" />,
    <ReminderCard key="b2" />,
    <PaidCard key="b3" />,
  ];
  const colC = [
    <ClientCard key="c1" />,
    <StatCard2 key="c2" />,
    <ExpenseCard key="c3" />,
  ];

  return (
    <div
      className="relative h-[600px] overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div className="absolute inset-0 flex justify-center gap-4">
        <ScrollColumn cards={colA} direction="up" duration={30} />
        <ScrollColumn cards={colB} direction="down" duration={36} />
        <ScrollColumn
          cards={colC}
          direction="up"
          duration={44}
          className="hidden xl:block"
        />
      </div>
    </div>
  );
}

function ScrollColumn({ cards, direction, duration, className }) {
  const doubled = [...cards, ...cards];
  const from = direction === "up" ? "0%" : "-50%";
  const to = direction === "up" ? "-50%" : "0%";
  return (
    <div className={cn("w-[228px] shrink-0", className)}>
      <motion.div
        className="flex flex-col gap-3.5"
        animate={{ y: [from, to] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </motion.div>
    </div>
  );
}

function WallCard({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-[22px] bg-white border border-black/[0.04] shadow-[0_24px_50px_-28px_rgba(13,42,37,0.45)] p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
const Label = ({ children }) => (
  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
    {children}
  </div>
);
const CardFoot = ({ children }) => (
  <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center gap-2">
    <span
      className="h-4 w-4 rounded-[5px]"
      style={{ background: `linear-gradient(135deg,${TEAL},${TEAL_DARK})` }}
    />
    <span className="text-[11px] font-medium text-gray-600">{children}</span>
  </div>
);

function Pill({ children, tone = "teal" }) {
  const s =
    tone === "teal"
      ? { background: "#d3f4ec", color: TEAL_DARK }
      : tone === "rose"
      ? { background: "#fde7ea", color: "#be123c" }
      : { background: "#fbf1e2", color: "#b45309" };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={s}
    >
      {children}
    </span>
  );
}

function InvoiceCard() {
  return (
    <WallCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <Label>Invoice</Label>
          <div className="text-[15px] font-bold text-gray-900 mt-1 tabular-nums">
            INV-0042
          </div>
        </div>
        <Pill>Sent</Pill>
      </div>
      {[
        ["Design sprint", "$3,200"],
        ["Development · 24h", "$2,280"],
      ].map(([d, a]) => (
        <div
          key={d}
          className="flex items-center justify-between text-[12px] py-0.5"
        >
          <span className="text-gray-500">{d}</span>
          <span className="text-gray-900 font-semibold tabular-nums">{a}</span>
        </div>
      ))}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
        <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
          Total
        </span>
        <span
          className="text-[17px] font-bold tabular-nums"
          style={{ color: TEAL_DARK }}
        >
          $5,480
        </span>
      </div>
      <CardFoot>Nova Retail Group</CardFoot>
    </WallCard>
  );
}

function RevenueCard() {
  return (
    <WallCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <Label>Total Revenue</Label>
          <div className="text-[26px] font-bold text-gray-900 mt-1 tabular-nums">
            $311K
          </div>
        </div>
        <Pill>
          <TrendingUp size={10} strokeWidth={2.5} /> +12%
        </Pill>
      </div>
      <div className="flex items-end gap-1.5 h-12">
        {[42, 58, 50, 72, 63, 88].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md"
            style={{
              height: `${h}%`,
              background: `linear-gradient(180deg,#2dd4bf,${TEAL_DARK})`,
              opacity: 0.45 + i * 0.09,
            }}
          />
        ))}
      </div>
      <CardFoot>Last 6 months</CardFoot>
    </WallCard>
  );
}

function ReceiptCard() {
  return (
    <WallCard>
      <div className="flex items-start justify-between mb-2.5">
        <Label>AI Receipt Scan</Label>
        <Pill>
          <ScanLine size={10} strokeWidth={2.5} /> Parsed
        </Pill>
      </div>
      <div className="rounded-xl p-3" style={{ background: "#d3f4ec" }}>
        <div
          className="text-[9px] uppercase tracking-wide font-semibold mb-1"
          style={{ color: TEAL_DARK }}
        >
          Extracted
        </div>
        <div className="text-[13px] font-semibold text-gray-900">Adobe Inc.</div>
        <div className="flex items-center justify-between text-[12px] text-gray-600 mt-1">
          <span>Creative Cloud ×1</span>
          <span className="tabular-nums font-bold text-gray-900">$54.99</span>
        </div>
      </div>
      <CardFoot>Image → invoice</CardFoot>
    </WallCard>
  );
}

function PaymentCard() {
  return (
    <WallCard>
      <div className="flex items-center gap-2.5">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: "#dcfce7" }}
        >
          <CheckCircle2 size={17} className="text-emerald-600" />
        </div>
        <div>
          <Label>Payment received</Label>
          <div className="text-[17px] font-bold text-gray-900 tabular-nums">
            $7,595.00
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3">
        <span>INV-0038 · Harbor & Co.</span>
        <span>Bank transfer</span>
      </div>
    </WallCard>
  );
}

function ReminderCard() {
  return (
    <WallCard>
      <div className="flex items-start justify-between mb-2.5">
        <Label>AI Reminder</Label>
        <Pill>
          <Sparkles size={10} strokeWidth={2.5} /> Drafted
        </Pill>
      </div>
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <BellRing size={12} style={{ color: TEAL_DARK }} />
          <span className="text-[12px] font-semibold text-gray-900">
            Friendly nudge
          </span>
        </div>
        <p className="text-[11.5px] text-gray-500 leading-snug">
          "Hi Nova — a gentle reminder that INV-0021 for $2,400 was due last week…"
        </p>
      </div>
      <CardFoot>One click to send</CardFoot>
    </WallCard>
  );
}

function PaidCard() {
  return (
    <WallCard>
      <div className="flex items-start justify-between mb-3">
        <Label>Paid this month</Label>
        <Pill>
          <Check size={10} strokeWidth={3} /> On track
        </Pill>
      </div>
      <div className="text-[28px] font-bold text-gray-900 tabular-nums">
        $42,180
      </div>
      <div className="flex items-center gap-1 mt-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="h-2 flex-1 rounded-full"
            style={{ background: i < 6 ? TEAL : "#e5e7eb" }}
          />
        ))}
      </div>
      <CardFoot>6 of 8 invoices paid</CardFoot>
    </WallCard>
  );
}

function ClientCard() {
  return (
    <WallCard>
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ background: `linear-gradient(135deg,${TEAL},${TEAL_DARK})` }}
        >
          B
        </div>
        <div>
          <div className="text-[13px] font-semibold text-gray-900">
            Brightline Studios
          </div>
          <div className="text-[11px] text-gray-400">New York, NY</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">
            Billed
          </div>
          <div className="text-[13px] font-bold text-gray-900 tabular-nums">
            $18.4K
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">
            Owed
          </div>
          <div
            className="text-[13px] font-bold tabular-nums"
            style={{ color: "#b45309" }}
          >
            $3.8K
          </div>
        </div>
      </div>
    </WallCard>
  );
}

function StatCard2() {
  return (
    <WallCard>
      <div className="flex items-center gap-2.5">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: "#d3f4ec" }}
        >
          <Wallet size={16} style={{ color: TEAL_DARK }} />
        </div>
        <div>
          <Label>Outstanding</Label>
          <div className="text-[17px] font-bold text-gray-900 tabular-nums">
            $23,760
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] mt-3">
        <span className="text-gray-500">12 open invoices</span>
        <Pill tone="rose">3 overdue</Pill>
      </div>
    </WallCard>
  );
}

function ExpenseCard() {
  return (
    <WallCard>
      <div className="flex items-center gap-2.5">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{ background: "#fbf1e2" }}
        >
          <Receipt size={16} style={{ color: "#b45309" }} />
        </div>
        <div>
          <Label>Expense</Label>
          <div className="text-[14px] font-bold text-gray-900">AWS · Hosting</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-[12px] mt-3">
        <span className="text-gray-500">Jul 2026 · card ****3140</span>
        <span className="tabular-nums font-bold text-gray-900">$128.40</span>
      </div>
    </WallCard>
  );
}

/* ───────────────── Marquee strip ───────────────── */
function Marquee() {
  const items = [
    "PostgreSQL",
    "NestJS",
    "TypeORM",
    "Redis Cache",
    "Agentic AI Copilot",
    "Next.js App Router",
    "Google Gemini",
    "PDF Invoices",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="border-y border-black/[0.05] bg-[#f5faf9] py-4 overflow-hidden">
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/[0.05] text-sm font-medium text-[#4a5f5a] shadow-sm whitespace-nowrap"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: TEAL }}
            />{" "}
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ───────────────── AI section ───────────────── */
const AI_FEATURES = [
  {
    icon: Bot,
    title: "Autonomous Copilot",
    desc: "A ReAct tool-calling AI agent that audits overdue balances, checks receivables, and triggers actions with live database execution.",
  },
  {
    icon: ScanLine,
    title: "Receipt scanning",
    desc: "Drop a photo or PDF — Gemini extracts vendor, date, line items, and pre-fills your expense or invoice.",
  },
  {
    icon: BellRing,
    title: "Payment reminders",
    desc: "Generate friendly, firm, or final-notice reminder emails tuned to how overdue an invoice is.",
  },
  {
    icon: Sparkles,
    title: "Revenue summaries",
    desc: "A plain-English read on your month: what's up, what's overdue, and exactly who to follow up with.",
  },
];

function AISection() {
  return (
    <section className="max-w-[1400px] mx-auto px-5 py-24">
      <SectionHead
        eyebrow="AI superpowers"
        title="Agentic AI built for finance"
        sub="Powered by Google Gemini and autonomous tool execution, built right into your billing workflow."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
        {AI_FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative p-6 rounded-[26px] bg-white border border-black/[0.05] shadow-[0_2px_10px_rgba(13,42,37,0.04)] hover:shadow-[0_24px_50px_-24px_rgba(13,42,37,0.28)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
          >
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "radial-gradient(circle, rgba(45,212,191,0.18), transparent 70%)",
              }}
            />
            <div
              className="relative h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_20px_-6px_rgba(13,148,136,0.6)]"
              style={{
                background: `linear-gradient(135deg,#14b8a6,${TEAL_DARK})`,
              }}
            >
              <f.icon size={22} />
            </div>
            <div className="text-[15px] font-bold text-gray-900 mt-5">
              {f.title}
            </div>
            <p className="text-sm text-[#5a6f6a] mt-2 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────── Core section ───────────────── */
const CORE = [
  {
    icon: FileText,
    title: "Smart invoices",
    desc: "Line-item builder with auto totals, tax, discounts, sequential numbering, and status tracking.",
  },
  {
    icon: Users,
    title: "Client CRM",
    desc: "Every client's billing history, outstanding balance, and payment status in one view.",
  },
  {
    icon: Wallet,
    title: "Payments & expenses",
    desc: "Log payments against invoices and track business expenses with automatic status reconciliation.",
  },
  {
    icon: BarChart3,
    title: "Revenue analytics",
    desc: "Real-time KPI cards, 6-month revenue trends, and 30/60/90-day aging buckets cached in Redis.",
  },
  {
    icon: Bot,
    title: "Agentic Copilot",
    desc: "Trigger multi-step financial workflows from a natural language conversational drawer.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise architecture",
    desc: "NestJS, TypeORM, PostgreSQL, and Redis caching for resilient scale.",
  },
];

function CoreSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#f5faf9] border-y border-black/[0.05]" />
      <div className="relative max-w-[1400px] mx-auto px-5">
        <SectionHead
          eyebrow="Everything you need"
          title="A complete billing workspace"
          sub="From first invoice to final payment — and every number in between."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {CORE.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group p-6 rounded-[26px] bg-white border border-black/[0.05] hover:border-[#0d9488]/30 shadow-[0_2px_10px_rgba(13,42,37,0.04)] hover:shadow-[0_20px_44px_-24px_rgba(13,42,37,0.25)] transition-all duration-300"
            >
              <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-[#d3f4ec] text-[#0f766e] group-hover:scale-110 transition-transform">
                <f.icon size={20} />
              </div>
              <div className="text-[15px] font-bold text-gray-900 mt-4 flex items-center gap-1.5">
                {f.title}
                <ArrowUpRight
                  size={15}
                  className="text-gray-300 group-hover:text-[#0d9488] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </div>
              <p className="text-sm text-[#5a6f6a] mt-2 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── CTA ───────────────── */
function CTASection() {
  return (
    <section className="max-w-[1400px] mx-auto px-5 py-24">
      <div
        className="relative rounded-[36px] px-8 py-24 text-center text-white overflow-hidden shadow-[0_40px_80px_-30px_rgba(15,118,110,0.5)]"
        style={{
          background:
            "linear-gradient(135deg,#0f766e 0%,#0d9488 45%,#115e56 100%)",
        }}
      >
        <div
          className="absolute -top-28 -right-24 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(94,234,212,0.4),transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(20,184,166,0.4),transparent 70%)",
          }}
        />

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-md">
            <Sparkles size={13} /> Get paid faster
          </span>
          <h2 className="font-display text-[clamp(30px,4.5vw,48px)] font-semibold tracking-tight mt-6">
            Send your first invoice in minutes.
          </h2>
          <p className="text-white/75 mt-4 max-w-md mx-auto text-lg">
            Free to start. No credit card required.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 mt-9 h-13 px-8 py-4 rounded-full bg-white text-[#0f766e] text-sm font-bold hover:shadow-[0_16px_40px_-10px_rgba(255,255,255,0.5)] transition-all"
          >
            Create your account{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Footer ───────────────── */
function Footer() {
  return (
    <footer className="border-t border-black/[0.05]">
      <div className="max-w-[1400px] mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AILogo />
          <span className="font-display font-semibold">Invoicer</span>
        </div>
        <span className="text-sm text-[#5a6f6a]">
          © {new Date().getFullYear()} Invoicer · Powered by NestJS, TypeORM, PostgreSQL, Redis & Next.js
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#0f766e] hover:underline"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-[#0f766e] hover:underline"
          >
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-[#0d9488] mb-3">
        {eyebrow}
      </span>
      <h2 className="font-display text-[clamp(28px,4vw,42px)] font-semibold tracking-tight text-gray-900">
        {title}
      </h2>
      <p className="text-[#5a6f6a] mt-3 text-lg">{sub}</p>
    </div>
  );
}
