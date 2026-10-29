
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { JSONContent } from "@tiptap/core";

import { getPublishedJournalArticle } from "@/lib/journal/public";
import SocialEmbed from "@/components/journal/SocialEmbed";

type Category = "bhangra" | "music";

type Props = {
  category: Category;
  params: Promise<{ id: string }>;
};

// Render only the rich-text elements supported by the editor.
function renderNode(
  node: JSONContent,
  key: number,
  category: Category
): ReactNode {
  if (node.type === "text") {
    let output: ReactNode = node.text ?? "";

    for (const mark of node.marks ?? []) {
      switch (mark.type) {
        case "bold":
          output = <strong>{output}</strong>;
          break;

        case "italic":
          output = <em>{output}</em>;
          break;

        case "underline":
          output = <u>{output}</u>;
          break;

        case "strike":
          output = <s>{output}</s>;
          break;

        case "link": {
          const href = mark.attrs?.href;

          if (typeof href === "string") {
            try {
              const url = new URL(href);

              if (
                url.protocol === "https:" ||
                url.protocol === "http:"
              ) {
                output = (
                  <a
                    href={url.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                    category === "bhangra"
                        ? "text-yellow-400 underline underline-offset-4 hover:text-yellow-300"
                        : "text-pink-400 underline underline-offset-4 hover:text-pink-300"
                    }
                  >
                    {output}
                  </a>
                );
              }
            } catch {
              // Ignore invalid links.
            }
          }

          break;
        }
      }
    }

    return <span key={key}>{output}</span>;
  }

  if (node.type === "hardBreak") {
    return <br key={key} />;
  }

  const children = (node.content ?? []).map(
    (child, index) => renderNode(child, index, category)
  );

  switch (node.type) {
    case "doc":
      return <div key={key}>{children}</div>;

    case "paragraph":
      return (
        <p key={key} className="mb-5 leading-8">
          {children}
        </p>
      );

    case "bulletList":
      return (
        <ul
          key={key}
          className="mb-5 list-disc space-y-2 pl-6"
        >
          {children}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={key}
          className="mb-5 list-decimal space-y-2 pl-6"
        >
          {children}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} className="[&>p]:mb-0">
          {children}
        </li>
      );

    default:
      return null;
  }
}

export default async function JournalArticle({
  category,
  params,
}: Props) {
  const { id } = await params;

  const entry = await getPublishedJournalArticle(
    category,
    id
  );

  if (!entry) notFound();

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${entry.date}T12:00:00Z`));

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 text-white sm:px-6 sm:py-20">
      <Link
        href={`/${category}/journal`}
        className={
            category === "bhangra"
            ? "text-sm text-yellow-400 hover:text-yellow-300"
            : "text-sm text-pink-400 hover:text-pink-300"
        }
        >
        ← Back to journal
      </Link>

      <header className="mt-12 mb-12">
        <p className="mb-4 text-sm text-gray-400">
          {formattedDate}
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {entry.title || "Journal entry"}
        </h1>
      </header>

      <div className="max-w-none text-base text-gray-300 sm:text-lg">
        {renderNode(entry.content as JSONContent, 0, category)}
      </div>

      {entry.media.length > 0 && (
        <section
          aria-label="Photos and videos"
          className="mt-12 space-y-10 border-t border-white/10 pt-10"
        >
          {entry.media.map((item, index) => {
            if (item.type === "image") {
              return (
                <figure key={item.id} className="space-y-3">
                  <Image
                    src={item.url}
                    alt={item.altText ?? ""}
                    width={1600}
                    height={1000}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="h-auto max-h-[75vh] w-full rounded-xl bg-[#161A22] object-contain"
                  />

                  {item.caption && (
                    <figcaption className="text-center text-sm text-gray-400">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }

            
            if (item.type === "video_embed") {
            return (
                <div
                key={item.id}
                className="mx-auto w-full max-w-2xl"
                >
                <SocialEmbed
                    url={item.url}
                    category={category}
                />
                </div>
            );
            }

            return null;
          })}
        </section>
      )}
    </article>
  );
}
