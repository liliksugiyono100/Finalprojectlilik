"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import type { DefectItem, Status } from "@/lib/types";

function formatTimestamp(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function TextField({
  label,
  value,
  onChange,
  textarea,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  maxLength?: number;
}) {
  const inputClass =
    "w-full border border-black/15 dark:border-white/20 rounded-md px-3 py-2 bg-transparent text-sm";
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-medium mb-1">
        <span>{label}</span>
        {maxLength && (
          <span className="text-xs font-normal text-black/50 dark:text-white/50">
            {value.length}/{maxLength}
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          className={`${inputClass} min-h-24`}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        />
      )}
    </label>
  );
}

export default function ItemPage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = usePromise(params);

  const [item, setItem] = useState<DefectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/items/${no}`)
      .then((res) => {
        if (!res.ok) throw new Error("Item tidak ditemukan");
        return res.json();
      })
      .then((data: DefectItem) => setItem(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [no]);

  function update<K extends keyof DefectItem>(field: K, value: DefectItem[K]) {
    setItem((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSave() {
    if (!item) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/items/${no}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error("Gagal menyimpan perubahan");
      const updated: DefectItem = await res.json();
      setItem(updated);
      setSavedAt(updated.last_updated_at);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8">
      <Link
        href="/"
        className="text-sm text-black/60 dark:text-white/60 hover:underline"
      >
        &larr; Kembali ke daftar
      </Link>

      {loading && <p className="mt-4">Memuat data...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {!loading && item && (
        <div className="mt-4">
          <h1 className="text-2xl font-bold mb-1">Item No. {item.no}</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mb-6">
            Terakhir update: {formatTimestamp(item.last_updated_at)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Area"
              value={item.area}
              onChange={(v) => update("area", v)}
            />
            <TextField
              label="Disiplin"
              value={item.disiplin}
              onChange={(v) => update("disiplin", v)}
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Defect & Outstanding Works"
              value={item.defect_and_outstanding_works}
              onChange={(v) => update("defect_and_outstanding_works", v)}
              textarea
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Permasalahan"
              value={item.permasalahan}
              onChange={(v) => update("permasalahan", v)}
              textarea
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="block text-sm font-medium mb-1">Status</span>
              <select
                className="w-full border border-black/15 dark:border-white/20 rounded-md px-3 py-2 bg-transparent text-sm"
                value={item.status}
                onChange={(e) => update("status", e.target.value as Status)}
              >
                <option value="Open">Open</option>
                <option value="Close">Close</option>
              </select>
            </label>
            <TextField
              label="PIC"
              value={item.pic}
              onChange={(v) => update("pic", v)}
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Keterangan"
              value={item.keterangan}
              onChange={(v) => update("keterangan", v)}
              textarea
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Feedback HK"
              value={item.feedback_hk}
              onChange={(v) => update("feedback_hk", v)}
              textarea
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <TextField
              label="Target Penyelesaian"
              value={item.target_penyelesaian}
              onChange={(v) => update("target_penyelesaian", v)}
            />
            <TextField
              label="D/O"
              value={item.d_o}
              onChange={(v) => update("d_o", v)}
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Status Update"
              value={item.status_update}
              onChange={(v) => update("status_update", v)}
              textarea
              maxLength={100}
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-foreground text-background px-5 py-2 text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            {savedAt && (
              <span className="text-sm text-green-700 dark:text-green-400">
                Tersimpan pada {formatTimestamp(savedAt)}
              </span>
            )}
          </div>
        </div>
      )}

      {!loading && !item && !error && <p className="mt-4">Item tidak ditemukan.</p>}
    </main>
  );
}
