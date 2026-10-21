
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDraft(formData: FormData) {
  // Always verify authorisation inside the Server Action.
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;

  if (!adminId || session?.githubId !== adminId) {
    redirect("/admin/login");
  }

  function getField(name: string) {
    const value = formData.get(name);
    return typeof value === "string" ? value.trim() : "";
  }

  const category = getField("category");
  const title = getField("title");
  const body = getField("body");
  const journalDate = getField("journalDate");
  const journalTime = getField("journalTime");

  // Validate all submitted data on the server.
  if (category !== "bhangra" && category !== "music") {
    throw new Error("Invalid journal category.");
  }

  if (title.length > 150 || body.length > 20000) {
    throw new Error("Journal entry exceeds the length limit.");
  }

  const parsedDate = new Date(`${journalDate}T00:00:00Z`);

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(journalDate) ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== journalDate
  ) {
    throw new Error("A valid journal date is required.");
  }

  if (
    journalTime &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(journalTime)
  ) {
    throw new Error("Invalid journal time.");
  }

  // Store simple text in a Tiptap-compatible JSON structure.
  const content = {
    type: "doc",
    content: body.split(/\r?\n/).map((line) => ({
      type: "paragraph",
      ...(line
        ? { content: [{ type: "text", text: line }] }
        : {}),
    })),
  };

  await db.insert(posts).values({
    category,
    title: title || null,
    content,
    journalDate,
    journalTime: journalTime || null,
    status: "draft",
  });

  revalidatePath("/admin");
  redirect("/admin");
}
