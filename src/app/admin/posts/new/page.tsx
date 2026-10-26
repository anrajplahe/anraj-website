
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import { createJournalDraft } from "../actions";

async function NewPostContent() {
  await connection();

  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;

  if (!adminId || session?.githubId !== adminId) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-white">
        New journal entry
      </h1>

      <p className="mt-3 text-gray-400">
        Start a new draft to open the journal editor.
      </p>

      <form action={createJournalDraft} className="mt-8">
        <button
          type="submit"
          className="rounded-lg bg-green-400 px-6 py-3 font-semibold text-[#0B0D14] hover:bg-green-300"
        >
          Create draft
        </button>
      </form>

      <Link
        href="/admin"
        className="mt-6 inline-block text-sm text-gray-400 hover:text-white"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <NewPostContent />
    </Suspense>
  );
}