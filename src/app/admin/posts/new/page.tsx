
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/auth";
import JournalDateTimeFields from "@/components/admin/JournalDateTimeFields";
import { createDraft } from "../actions";

async function NewPostContent() {
  await connection();

  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;

  if (!adminId || session?.githubId !== adminId) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/admin"
        className="mb-8 inline-block text-sm text-gray-400 hover:text-white"
      >
        ← Back to dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-white">
          Create journal entry
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Write a new Bhangra or Guitar & Music journal entry.
        </p>
      </div>

      <form action={createDraft} className="space-y-8">
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm text-gray-400"
          >
            Journal *
          </label>

          <select
            id="category"
            name="category"
            required
            defaultValue="bhangra"
            className="w-full rounded-lg border border-white/15 bg-[#161A22] px-4 py-3 text-white focus:border-green-400 focus:outline-none"
          >
            <option value="bhangra">Bhangra</option>
            <option value="music">Guitar & Music</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm text-gray-400"
          >
            Title (optional)
          </label>

          <input
            id="title"
            name="title"
            type="text"
            maxLength={150}
            placeholder="Give your entry a title..."
            className="w-full rounded-lg border border-white/15 bg-[#161A22] px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-400 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="body"
            className="block text-sm text-gray-400"
          >
            Content
          </label>

          <textarea
            id="body"
            name="body"
            rows={10}
            maxLength={20000}
            placeholder="Start writing your journal entry..."
            className="w-full resize-y rounded-lg border border-white/15 bg-[#161A22] px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-400 focus:outline-none"
          />

          <p className="text-xs text-gray-500">
            Rich-text formatting and media will be added next.
          </p>
        </div>

        <section className="space-y-4 rounded-xl border border-white/10 p-5">
          <h2 className="font-semibold text-white">
            Entry settings
          </h2>

          <JournalDateTimeFields />

          <p className="text-xs text-gray-500">
            Journal dates control chronological ordering.
            You can backdate entries.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <span className="text-sm text-gray-400">
            Status: Draft
          </span>

          <button
            type="submit"
            className="rounded-lg bg-green-400 px-6 py-3 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-green-300"
          >
            Save draft
          </button>
        </div>
      </form>
    </main>
  );
}

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-gray-400">
          Loading editor...
        </p>
      }
    >
      <NewPostContent />
    </Suspense>
  );
}
