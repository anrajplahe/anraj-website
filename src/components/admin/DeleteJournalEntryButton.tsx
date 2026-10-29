"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteJournalEntry } from "@/app/admin/posts/actions";

type Props = { id: string; version: string; title: string | null };

export default function DeleteJournalEntryButton({ id, version, title }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm(
      `Permanently delete "${title || "Untitled entry"}"? This cannot be undone.`
    )) return;

    setBusy(true);
    setError("");
    try {
      await deleteJournalEntry(id, version);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete entry.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={remove}
        className="text-sm font-medium text-red-300 transition-colors hover:text-red-200 disabled:opacity-50"
      >
        {busy ? "Deleting..." : "Delete"}
      </button>
      {error && <span role="alert" className="max-w-xs text-xs text-red-300">{error}</span>}
    </div>
  );
}
