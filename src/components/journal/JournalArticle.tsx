
import Image from "next/image";
import ActionLink from "@/components/ActionLink";
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
    <article className={`journal-article ${category === "bhangra" ? "journal-article-bhangra" : "journal-article-music"} mx-auto max-w-5xl px-4 py-12 text-white sm:px-6 sm:py-20`}>
      <ActionLink href={`/${category}/journal`} accent={category === "bhangra" ? "yellow" : "pink"} arrow="back">
        Back to journal
      </ActionLink>

      <header className="journal-article-heading mx-auto mb-12 mt-10 max-w-3xl border-b border-white/10 pb-10 sm:mb-14 sm:mt-12 sm:pb-12">
        <p className="journal-article-category mb-5 text-xs font-semibold uppercase tracking-[0.18em]">{category === "bhangra" ? "Bhangra" : "Music"} / Journal</p>
        <time dateTime={entry.date} className="mb-5 block text-sm text-slate-400">
          {formattedDate}
        </time>

        <h1 className="break-words text-4xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl md:text-6xl">
          {entry.title || "Journal entry"}
        </h1>
      </header>

      <div className="journal-article-prose mx-auto max-w-[42rem] text-base text-slate-300 sm:text-lg">
        {renderNode(entry.content as JSONContent, 0, category)}
      </div>

      {entry.media.length > 0 && (
        <section
          aria-label="Photos and videos"
          className="journal-article-media mt-14 space-y-10 border-t border-white/10 pt-10 sm:mt-16 sm:space-y-12 sm:pt-12"
        >
          {entry.media.map((item) => {
            if (item.type === "image") {
              return (
                <figure key={item.id} className="space-y-4">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="journal-article-image block rounded-2xl" aria-label={item.altText ? `Open full-size image: ${item.altText}` : "Open full-size image"}>
                  <Image
                    src={item.url}
                    alt={item.altText ?? ""}
                    width={1600}
                    height={1000}
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 976px"
                    className="h-auto max-h-[85vh] w-full rounded-2xl border border-white/[0.08] bg-[#10141e] object-contain"
                  />

                  </a>

                  {item.caption && (
                    <figcaption className="mx-auto max-w-2xl px-2 text-center text-sm leading-relaxed text-slate-400">
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
                className="mx-auto w-full min-w-0 max-w-3xl rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 sm:p-5"
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
