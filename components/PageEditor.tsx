"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getPage, updatePage, deletePage, type Block, addBlockBelow, removeBlock, toggleBlockCheck, moveBlock, changeBlockType, setBlockColor } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { ArrowLeft, Bold, CheckSquare, Code, Delete, Italic, List, PaintBucket, Plus, Redo2, Strikethrough, Trash2, Type, Undo2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export function PageEditor({ pageId }: { pageId: string }) {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [color, setColor] = useState<string>("linear-gradient(90deg,#8b5cf6,#06b6d4)");
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  useEffect(() => {
    const page = getPage(pageId);
    if (page) {
      setTitle(page.title);
      setBlocks(page.blocks);
      setColor(page.color);
    }
  }, [pageId]);

  useEffect(() => {
    const id = setInterval(() => {
      updatePage(pageId, { title, blocks, color });
      setLastSaved(Date.now());
    }, 800);
    return () => clearInterval(id);
  }, [pageId, title, blocks, color]);

  const addNewBlock = (index: number) => {
    const b = addBlockBelow(pageId, index);
    setBlocks([...getPage(pageId)!.blocks]);
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-block-id="${b.id}"]`) as HTMLElement | null;
      el?.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, idx: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNewBlock(idx);
    }
    if (e.key === "Backspace") {
      const block = blocks[idx];
      if (!block.text) {
        e.preventDefault();
        removeBlock(pageId, block.id);
        setBlocks([...getPage(pageId)!.blocks]);
      }
    }
  };

  const toolbarColors = [
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
  ];

  const setPageAccent = (c: string) => {
    setColor(`linear-gradient(90deg, ${c}, #06b6d4)`);
  };

  const setBlockAccent = (id: string, c: string) => {
    setBlockColor(pageId, id, c);
    setBlocks([...getPage(pageId)!.blocks]);
  };

  const page = getPage(pageId);
  if (!page) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white/70 p-8">Page not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl overflow-hidden border border-white/60 bg-white/70 backdrop-blur shadow-sm">
        <div className="h-28 w-full" style={{ background: color }} />
        <div className="p-6">
          <input
            className="w-full text-3xl font-semibold bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-2 items-center">
            {toolbarColors.map((c) => (
              <button
                key={c}
                className="size-8 rounded-full border border-white/70 shadow"
                style={{ background: c }}
                onClick={() => setPageAccent(c)}
                aria-label="Set page color"
              />
            ))}
            <span className="ml-2 text-xs text-slate-500">
              {lastSaved ? `Saved ${Math.round((Date.now() - lastSaved) / 1000)}s ago` : "Saving..."}
            </span>
            <button
              className="ml-auto inline-flex items-center gap-2 text-xs text-rose-600 hover:underline"
              onClick={() => {
                deletePage(pageId);
                location.href = "/";
              }}
            >
              <Trash2 className="size-4" /> Delete page
            </button>
          </div>

          <div className="mt-8 space-y-2">
            {blocks.map((block, idx) => (
              <div key={block.id} className="group flex items-start gap-2">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                  <button
                    className="size-7 rounded-md border bg-white text-slate-600 shadow hover:bg-slate-50"
                    onClick={() => addNewBlock(idx)}
                    title="Add block"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <select
                      className="rounded-md border bg-white px-2 py-1"
                      value={block.type}
                      onChange={(e) => {
                        changeBlockType(pageId, block.id, e.target.value as Block["type"]);
                        setBlocks([...getPage(pageId)!.blocks]);
                      }}
                    >
                      <option value="p">Paragraph</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="todo">To-do</option>
                      <option value="code">Code</option>
                      <option value="bullets">Bulleted List</option>
                    </select>

                    <div className="flex items-center gap-1">
                      {toolbarColors.map((c) => (
                        <button
                          key={c}
                          className={clsx(
                            "size-5 rounded-full border border-white/70",
                            block.color === c && "ring-2 ring-offset-2 ring-offset-white ring-brand-500"
                          )}
                          style={{ background: c }}
                          onClick={() => setBlockAccent(block.id, c)}
                          aria-label="Set block color"
                        />
                      ))}
                    </div>
                  </div>

                  {block.type === "todo" ? (
                    <label className="flex items-center gap-3 rounded-lg bg-white/60 px-3 py-2 shadow-inner">
                      <input
                        type="checkbox"
                        checked={!!block.checked}
                        onChange={() => {
                          toggleBlockCheck(pageId, block.id);
                          setBlocks([...getPage(pageId)!.blocks]);
                        }}
                      />
                      <div
                        data-block-id={block.id}
                        data-editable
                        contentEditable
                        suppressContentEditableWarning
                        className="flex-1 outline-none"
                        onInput={(e) => {
                          const text = (e.target as HTMLElement).innerText;
                          updatePage(pageId, { blocks: blocks.map(b => b.id === block.id ? { ...b, text } : b) });
                          setBlocks([...getPage(pageId)!.blocks]);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      >
                        {block.text}
                      </div>
                    </label>
                  ) : block.type === "code" ? (
                    <pre className="rounded-lg bg-slate-900 text-slate-50 p-4 text-sm overflow-x-auto">
                      <code
                        data-block-id={block.id}
                        data-editable
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          const text = (e.target as HTMLElement).innerText;
                          updatePage(pageId, { blocks: blocks.map(b => b.id === block.id ? { ...b, text } : b) });
                          setBlocks([...getPage(pageId)!.blocks]);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                      >
                        {block.text || "// code"}
                      </code>
                    </pre>
                  ) : block.type === "bullets" ? (
                    <div className="rounded-lg bg-white/60 px-4 py-3 shadow-inner">
                      <div
                        data-block-id={block.id}
                        data-editable
                        contentEditable
                        suppressContentEditableWarning
                        className="outline-none"
                        onInput={(e) => {
                          const text = (e.target as HTMLElement).innerText;
                          updatePage(pageId, { blocks: blocks.map(b => b.id === block.id ? { ...b, text } : b) });
                          setBlocks([...getPage(pageId)!.blocks]);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        style={{ borderLeft: `4px solid ${block.color ?? "#e2e8f0"}`, paddingLeft: 12 }}
                      >
                        {block.text}
                      </div>
                    </div>
                  ) : (
                    <div
                      data-block-id={block.id}
                      data-editable
                      contentEditable
                      suppressContentEditableWarning
                      className={clsx(
                        "rounded-lg bg-white/60 px-3 py-2 shadow-inner outline-none",
                        block.type === "h1" && "text-3xl font-semibold",
                        block.type === "h2" && "text-xl font-semibold"
                      )}
                      onInput={(e) => {
                        const text = (e.target as HTMLElement).innerText;
                        updatePage(pageId, { blocks: blocks.map(b => b.id === block.id ? { ...b, text } : b) });
                        setBlocks([...getPage(pageId)!.blocks]);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      style={{ borderLeft: `4px solid ${block.color ?? "#e2e8f0"}`, paddingLeft: 12 }}
                    >
                      {block.text}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-slate-700 shadow hover:bg-slate-50"
              onClick={() => addNewBlock(blocks.length - 1)}
            >
              <Plus className="size-4" /> Add block
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
