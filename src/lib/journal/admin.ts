import "server-only";
import { auth } from "@/auth";

export async function requireJournalAdmin() {
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;
  if (!adminId || session?.githubId !== adminId) throw new Error("Unauthorised.");
}
