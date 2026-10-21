
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

async function AdminContent() {
  const session = await auth();
  const adminGitHubId = process.env.ADMIN_GITHUB_ID;

  // Reject unauthenticated or unauthorised visitors.
  if (!adminGitHubId || session?.githubId !== adminGitHubId) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-5xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-green-400">
            Administrator
          </p>

          <h1 className="text-3xl font-semibold text-white">
            Dashboard
          </h1>

          <p className="mt-3 text-gray-400">
            Welcome back. You're signed in securely.
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
            className="rounded-lg border border-white/20 px-5 py-2 text-sm text-white hover:border-white/50"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="rounded-xl border border-white/10 p-6">
        <h2 className="text-lg font-medium text-white">
          Journal Management
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Your Bhangra and Guitar & Music journal publishing
          tools will appear here.
        </p>
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="p-8 text-gray-400">Loading dashboard...</p>}>
      <AdminContent />
    </Suspense>
  );
}
