"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DefectItem } from "@/lib/types";

function formatTimestamp(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Home() {
  const [items, setItems] = useState<DefectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [picFilter, setPicFilter] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then((data: DefectItem[]) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const picOptions = useMemo(
    () => Array.from(new Set(items.map((i) => i.pic))).sort(),
    [items]
  );

  const filteredItems = useMemo(
    () => (picFilter ? items.filter((i) => i.pic === picFilter) : items),
    [items, picFilter]
  );

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-1">Defect &amp; Outstanding Works</h1>
      <p className="text-sm text-black/60 dark:text-white/60 mb-6">
        {filteredItems.length} dari {items.length} item
      </p>

      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="pic-filter" className="text-sm font-medium">
          Filter PIC:
        </label>
        <select
          id="pic-filter"
          value={picFilter}
          onChange={(e) => setPicFilter(e.target.value)}
          className="border border-black/15 dark:border-white/20 rounded-md px-3 py-1.5 bg-transparent text-sm"
        >
          <option value="">Semua PIC</option>
          {picOptions.map((pic) => (
            <option key={pic} value={pic}>
              {pic}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto border border-black/10 dark:border-white/15 rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/10 text-left">
                <th className="px-3 py-2 font-semibold">No</th>
                <th className="px-3 py-2 font-semibold">Area</th>
                <th className="px-3 py-2 font-semibold">Disiplin</th>
                <th className="px-3 py-2 font-semibold">
                  Defect / Outstanding Works
                </th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Status Update</th>
                <th className="px-3 py-2 font-semibold">PIC</th>
                <th className="px-3 py-2 font-semibold">Terakhir Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.no}
                  className="border-t border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <td className="p-0 align-top">
                    <Link
                      href={`/item/${item.no}`}
                      className="block px-3 py-2 font-medium"
                    >
                      {item.no}
                    </Link>
                  </td>
                  <td className="p-0 align-top">
                    <Link href={`/item/${item.no}`} className="block px-3 py-2">
                      {item.area}
                    </Link>
                  </td>
                  <td className="p-0 align-top">
                    <Link href={`/item/${item.no}`} className="block px-3 py-2">
                      {item.disiplin}
                    </Link>
                  </td>
                  <td className="p-0 align-top max-w-xs">
                    <Link
                      href={`/item/${item.no}`}
                      className="block px-3 py-2 truncate"
                    >
                      {item.defect_and_outstanding_works}
                    </Link>
                  </td>
                  <td className="p-0 align-top">
                    <Link href={`/item/${item.no}`} className="block px-3 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "Open"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </Link>
                  </td>
                  <td className="p-0 align-top max-w-xs">
                    <Link
                      href={`/item/${item.no}`}
                      className="block px-3 py-2 truncate"
                      title={item.status_update}
                    >
                      {item.status_update || "-"}
                    </Link>
                  </td>
                  <td className="p-0 align-top">
                    <Link href={`/item/${item.no}`} className="block px-3 py-2">
                      {item.pic}
                    </Link>
                  </td>
                  <td className="p-0 align-top whitespace-nowrap">
                    <Link href={`/item/${item.no}`} className="block px-3 py-2">
                      {formatTimestamp(item.last_updated_at)}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
