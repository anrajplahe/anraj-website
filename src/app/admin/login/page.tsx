
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { connection } from "next/server";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

async function LoginContent({ searchParams }: LoginPageProps) {
  await connection();

  const session = await auth();
  const { error } = await searchParams;

  const adminGitHubId = process.env.ADMIN_GITHUB_ID;

  // An authorised administrator doesn't need to log in again.
  if (adminGitHubId && session?.githubId === adminGitHubId) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-3 text-3xl font-semibold text-white">
        Admin Login
      </h1>

      <p className="mb-8 text-sm text-gray-400">
        Sign in with your authorised GitHub account to
        manage your website.
      </p>

      {error && (
        <p role="alert" className="mb-5 text-sm text-red-400">
          Sign-in was unsuccessful or access was denied.
        </p>
      )}

      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/admin" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition-colors hover:border-white/50"
        >
          Sign in with GitHub
        </button>
      </form>
    </div>
  );
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={<p className="p-8 text-gray-400">Loading login...</p>}>
      <LoginContent searchParams={props.searchParams} />
    </Suspense>
  );
}
