
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { auth } from "@/auth";
import { db } from "@/db";
import { posts } from "@/db/schema";
import JournalDraftEditor from "@/components/admin/JournalDraftEditor";

type Props = {
  params: Promise<{ id: string }>;
};

async function EditContent({ params }: Props) {
  await connection();

  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;

  if (!adminId || session?.githubId !== adminId) {
    redirect("/admin/login");
  }

  const { id } = await params;

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id
    )
  ) {
    notFound();
  }

  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  if (!post) {
    notFound();
  }

  // The client session loads fresh fields on every activation, including Back.
  return <JournalDraftEditor id={post.id} />;
}

export default function EditPostPage(props: Props) {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-gray-400">
          Loading journal editor...
        </p>
      }
    >
      <EditContent params={props.params} />
    </Suspense>
  );
}
