
import type { MetadataRoute } from "next";
import { connection } from "next/server";
import {
  and,
  eq,
  isNotNull,
} from "drizzle-orm";

import { db } from "@/db";
import { posts } from "@/db/schema";

const SITE_URL = "https://anrajplahe.com";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {

  // Generate this from the current published data,
  // not a database snapshot taken during the build.
  await connection();

  // Static public pages.
  const pages = [
    "/",
    "/projects",
    "/tech",
    "/bhangra",
    "/music",
    "/bhangra/journal",
    "/music/journal",
  ];

  const staticUrls: MetadataRoute.Sitemap =
    pages.map((path) => ({
      url: `${SITE_URL}${path}`,
      priority: path === "/" ? 1 : 0.7,
    }));

  // Only entries that are publicly readable.
  const entries = await db
    .select({
      id: posts.id,
      category: posts.category,
    })
    .from(posts)
    .where(
      and(
        eq(posts.status, "published"),
        isNotNull(posts.journalDate)
      )
    );

  const journalUrls: MetadataRoute.Sitemap =
    entries.map((entry) => ({
      url:
        `${SITE_URL}/${entry.category}/${entry.id}`,
      priority: 0.6,
    }));

  return [...staticUrls, ...journalUrls];
}
