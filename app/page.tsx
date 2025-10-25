import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { PageEditor } from "@/components/PageEditor";

export default function HomePage() {
  return (
    <div className="min-h-screen grid grid-cols-[var(--sidebar-width)_1fr]">
      <Sidebar />
      <div className="p-6">
        <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur shadow-sm p-10">
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-brand-600 via-cyan-600 to-rose-600 bg-clip-text text-transparent">Welcome to Notion Colorful</h1>
          <p className="mt-3 text-slate-600">Create your first page to get started.</p>
          <Link href="/new" className="inline-flex mt-6 items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-cyan-600 text-white px-4 py-2 shadow hover:shadow-md transition-shadow">
            New Page
          </Link>
        </div>
      </div>
    </div>
  );
}
