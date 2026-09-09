"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Package, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useItems, useItemMutations } from "@/hooks/useFeatures";
import { formatMoney } from "@/lib/utils";

export default function ItemsPage() {
  const { data: items, isLoading } = useItems();
  const [modal, setModal] = useState(null);
  const { remove } = useItemMutations();

  async function onDelete(e, item) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    await remove.mutateAsync(item.id);
  }

  return (
    <div>
      <PageHeader
        title="Items & Services"
        description="Reusable products and services you can drop into any invoice."
        actions={
          <Button variant="accent" onClick={() => setModal({})}>
            <Plus size={16} /> Add Item
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-3xl" />
          ))}
        </div>
      ) : !items?.length ? (
        <EmptyState
          icon={Package}
          title="No items yet"
          description="Save your common services and their rates to speed up invoicing."
          action={
            <Button variant="accent" onClick={() => setModal({})}>
              <Plus size={16} /> Add Item
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} padding="lg" className="group cursor-pointer" onClick={() => setModal(item)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-[var(--ink)] truncate">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-[var(--ink-muted)] line-clamp-2 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal(item);
                    }}
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={(e) => onDelete(e, item)}
                    className="h-7 w-7 rounded-full flex items-center justify-center text-[var(--ink-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--danger)] cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-baseline justify-between">
                <span className="text-xs text-[var(--ink-muted)]">Rate</span>
                <span className="text-base font-semibold text-[var(--ink)] tabular">
                  {formatMoney(item.rate)}{item.unit ? <span className="text-xs text-[var(--ink-muted)] font-normal"> / {item.unit}</span> : ""}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ItemModal open={!!modal} item={modal} onClose={() => setModal(null)} />
    </div>
  );
}

function ItemModal({ open, item, onClose }) {
  const isEdit = !!item?.id;
  const { create, update } = useItemMutations();
  const [form, setForm] = useState(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: item?.name || "",
        description: item?.description || "",
        rate: item?.rate ?? "",
        unit: item?.unit || "",
      });
      setErr("");
    }
  }, [open, item]);

  if (!form) return null;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setErr("Name is required");
    setSaving(true);
    setErr("");
    try {
      const payload = { ...form, rate: Number(form.rate) || 0 };
      if (isEdit) await update.mutateAsync({ id: item.id, payload });
      else await create.mutateAsync(payload);
      onClose();
    } catch (ex) {
      setErr(ex.message || "Couldn't save item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[var(--ink)]/30 backdrop-blur-sm" onClick={onClose} />
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[440px] rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-hover p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg font-semibold tracking-tight">{isEdit ? "Edit item" : "Add item / service"}</h3>
              <button type="button" onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center text-[var(--ink-muted)] hover:bg-[var(--surface-2)] cursor-pointer"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <label className="block">
                <span className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">Name *</span>
                <Input value={form.name} onChange={set("name")} placeholder="e.g. Website Design" required />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">Description</span>
                <Input value={form.description} onChange={set("description")} placeholder="Short summary" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">Default rate</span>
                  <Input type="number" min="0" step="0.01" value={form.rate} onChange={set("rate")} placeholder="0.00" className="tabular" />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-[var(--ink-muted)] mb-1.5">Unit</span>
                  <Input value={form.unit} onChange={set("unit")} placeholder="hr, day, item" />
                </label>
              </div>
            </div>
            {err && <p className="text-sm text-[var(--danger)] mt-3">{err}</p>}
            <div className="flex items-center justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="accent" disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {isEdit ? "Save" : "Add item"}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
