"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateNewPage } from "@/lib/store";

export default function NewPage() {
  const router = useRouter();
  useEffect(() => {
    const id = getOrCreateNewPage();
    router.replace(`/p/${id}`);
  }, [router]);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="rounded-xl border bg-white/70 p-6 shadow">Creating page...</div>
    </div>
  );
}
