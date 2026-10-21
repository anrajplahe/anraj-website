
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import {
  getAdminDashboardData,
  type AdminPostFilters,
} from "@/db/queries/admin-posts";

// Format journal dates for display
function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

// URL search parameters
type DashboardSearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
  status?: string | string[];
  sort?: string | string[];
}>;

function firstValue(
  value: string | string[] | undefined
): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

async function AdminContent({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  await connection();

  // Verify administrator authentication
  const session = await auth();
  const adminGitHubId = process.env.ADMIN_GITHUB_ID;

  if (!adminGitHubId || session?.githubId !== adminGitHubId) {
    redirect("/admin/login");
  }

  // Read search and filter parameters
  const params = await searchParams;

  const category = firstValue(params.category);
  const status = firstValue(params.status);
  const sort = firstValue(params.sort);

  const filters: AdminPostFilters = {
    query: firstValue(params.q).trim().slice(0, 100),

    category:
      category === "bhangra" || category === "music"
        ? category
        : "all",

    status:
      status === "draft" || status === "published"
        ? status
        : "all",

    sort:
      sort === "created" || sort === "updated"
        ? sort
        : "journal",
  };

  // Only query the database after authorisation
  const { statistics, entries, matchedCount } =
    await getAdminDashboardData(filters);

  const summary = [
    { label: "Total entries", value: statistics.total },
    { label: "Published", value: statistics.published },
    { label: "Drafts", value: statistics.drafts },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">

      {/* Dashboard heading and sign out */}
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-green-400">
            Administrator
          </p>

          <h1 className="text-3xl font-semibold text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Your journals, in one place.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/50 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Journal statistics */}
      <section
        aria-label="Journal statistics"
        className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-[#161A22] p-5"
          >
            <p className="text-sm text-gray-400">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* Journal entries */}
      <section>

        {/* Section heading and new entry button */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Journal entries
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Manage your Bhangra and Guitar & Music journals.
            </p>
          </div>

          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-green-300"
          >
            + New entry
          </Link>
        </div>

        {/* Search, filters and sorting */}
        <form
          action="/admin"
          method="get"
          className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Search */}
          <label className="flex flex-col gap-2 text-sm text-gray-400">
            Search
            <input
              name="q"
              type="search"
              maxLength={100}
              defaultValue={filters.query}
              placeholder="Search entries..."
              className="rounded-lg border border-white/15 bg-[#161A22] px-3 py-2.5 text-white placeholder:text-gray-500 focus:border-green-400 focus:outline-none"
            />
          </label>

          {/* Journal filter */}
          <label className="flex flex-col gap-2 text-sm text-gray-400">
            Journal
            <select
              name="category"
              defaultValue={filters.category}
              className="rounded-lg border border-white/15 bg-[#161A22] px-3 py-2.5 text-white focus:border-green-400 focus:outline-none"
            >
              <option value="all">All journals</option>
              <option value="bhangra">Bhangra</option>
              <option value="music">Guitar & Music</option>
            </select>
          </label>

          {/* Status filter */}
          <label className="flex flex-col gap-2 text-sm text-gray-400">
            Status
            <select
              name="status"
              defaultValue={filters.status}
              className="rounded-lg border border-white/15 bg-[#161A22] px-3 py-2.5 text-white focus:border-green-400 focus:outline-none"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          {/* Sorting */}
          <label className="flex flex-col gap-2 text-sm text-gray-400">
            Sort by
            <select
              name="sort"
              defaultValue={filters.sort}
              className="rounded-lg border border-white/15 bg-[#161A22] px-3 py-2.5 text-white focus:border-green-400 focus:outline-none"
            >
              <option value="journal">
                Journal date (newest)
              </option>
              <option value="created">
                Recently created
              </option>
              <option value="updated">
                Recently updated
              </option>
            </select>
          </label>

          {/* Filter actions */}
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-green-400 px-5 py-2.5 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-green-300"
            >
              Apply filters
            </button>

            <Link
              href="/admin"
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Reset
            </Link>

            <span className="ml-auto text-sm text-gray-400">
              {matchedCount} matching entries
            </span>
          </div>
        </form>

        {/* Journal entries list */}
        {entries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
            <h3 className="text-lg font-medium text-white">
              {statistics.total === 0
                ? "No journal entries yet"
                : "No matching entries"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
              {statistics.total === 0
                ? "Create your first journal entry to get started."
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex flex-wrap items-center justify-between gap-4 p-5 ${
                  index !== 0
                    ? "border-t border-white/10"
                    : ""
                }`}
              >
                {/* Entry details */}
                <div>
                  <h3 className="font-medium text-white">
                    {entry.title || "Untitled entry"}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span
                      className={
                        entry.category === "bhangra"
                          ? "text-yellow-400"
                          : "text-pink-400"
                      }
                    >
                      {entry.category === "bhangra"
                        ? "Bhangra"
                        : "Guitar & Music"}
                    </span>

                    <span className="text-gray-400">
                      {formatDate(entry.journalDate)}
                      {entry.journalTime
                        ? ` · ${entry.journalTime.slice(0, 5)}`
                        : ""}
                    </span>
                  </div>
                </div>

                {/* Publication status */}
                <span
                  className={
                    entry.status === "published"
                      ? "text-sm text-green-400"
                      : "text-sm text-gray-400"
                  }
                >
                  {entry.status === "published"
                    ? "Published"
                    : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Page wrapper for request-time rendering
export default function AdminPage({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-gray-400">
          Loading dashboard...
        </p>
      }
    >
      <AdminContent searchParams={searchParams} />
    </Suspense>
  );
}
