import { Sidebar } from "@/components/Sidebar";
import { PageEditor } from "@/components/PageEditor";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen grid grid-cols-[var(--sidebar-width)_1fr]">
      <Sidebar activeId={params.id} />
      <div className="p-6">
        <PageEditor pageId={params.id} />
      </div>
    </div>
  );
}
