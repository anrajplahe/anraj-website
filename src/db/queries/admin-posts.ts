
import "server-only";

import { db } from "@/db";
import { posts } from "@/db/schema";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
} from "drizzle-orm";

export type AdminPostFilters = {
  query: string;
  category: "all" | "bhangra" | "music";
  status: "all" | "draft" | "published";
  sort: "journal" | "created" | "updated";
};

export async function getAdminDashboardData(
  filters: AdminPostFilters
) {
  // Escape SQL LIKE wildcards so searches are treated literally.
  const searchPattern = `%${filters.query.replace(
    /[\\%_]/g,
    "\\$&"
  )}%`;

  const conditions = and(
    filters.category !== "all"
      ? eq(posts.category, filters.category)
      : undefined,

    filters.status !== "all"
      ? eq(posts.status, filters.status)
      : undefined,

    filters.query
      ? or(
          ilike(posts.title, searchPattern),
          ilike(
            sql<string>`${posts.content}::text`,
            searchPattern
          )
        )
      : undefined
  );

  const ordering =
    filters.sort === "created"
      ? [desc(posts.createdAt), desc(posts.id)]
      : filters.sort === "updated"
        ? [desc(posts.updatedAt), desc(posts.id)]
        : [
            sql`${posts.journalDate} DESC NULLS LAST`,
            sql`${posts.journalTime} DESC NULLS LAST`,
            desc(posts.createdAt),
            desc(posts.id),
          ];

  const [counts, matchingCounts, entries] =
    await Promise.all([
      db
        .select({
          total: count(),
          published: sql<number>`
            count(*) filter (
              where ${posts.status} = 'published'
            )
          `.mapWith(Number),
          drafts: sql<number>`
            count(*) filter (
              where ${posts.status} = 'draft'
            )
          `.mapWith(Number),
        })
        .from(posts),

      db
        .select({ total: count() })
        .from(posts)
        .where(conditions),

      db
        .select({
          id: posts.id,
          title: posts.title,
          category: posts.category,
          status: posts.status,
          journalDate: posts.journalDate,
          journalTime: posts.journalTime,
          hasPendingRevision:
            sql<boolean>`${posts.pendingRevision} IS NOT NULL`,
        })
        .from(posts)
        .where(conditions)
        .orderBy(...ordering)
        .limit(50),
    ]);

  return {
    statistics: counts[0] ?? {
      total: 0,
      published: 0,
      drafts: 0,
    },
    matchedCount: matchingCounts[0]?.total ?? 0,
    entries,
  };
}
