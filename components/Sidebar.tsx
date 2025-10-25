"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search, Palette, NotebookPen } from "lucide-react";
import { listPages, createPage } from "@/lib/store";
import clsx from "clsx";

export function Sidebar({ activeId }: { activeId?: string }) {
  const [pages, setPages] = useState<Array<{ id: string; title: string; color: string }>>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const update = () => setPages(listPages());
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  const filtered = pages.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <aside className="h-screen sticky top-0 border-r border-white/50 bg-white/60 backdrop-blur p-4">
      <div className="flex items-center gap-2 px-2">
        <NotebookPen className="text-brand-600" />
        <span className="font-semibold">Notion Colorful</span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 shadow-inner">
        <Search className="size-4 text-slate-400" />
        <input
          className="w-full bg-transparent outline-none text-sm"
          placeholder="Search pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-500">Pages</span>
        <Link
          href="/new"
          className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-600"
          title="New page"
        >
          <Plus className="size-4" /> New
        </Link>
      </div>

      <nav className="mt-2 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/p/${p.id}`}
            className={clsx(
              "group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-white",
              activeId === p.id && "bg-white shadow"
            )}
          >
            <span className="size-2 rounded-full" style={{ background: p.color }} />
            <span className="truncate text-sm">{p.title || "Untitled"}</span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-slate-500 px-2 py-4">No pages found.</div>
        )}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-500 flex items-center gap-2">
        <Palette className="size-4 text-rose-500" />
        Colors bring your notes to life ✨
      </div>
    </aside>
  );
}
