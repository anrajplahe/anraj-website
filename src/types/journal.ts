import type { JSONContent } from "@tiptap/core";

export type JournalDraftFields = {
  category: "bhangra" | "music";
  title: string;
  content: JSONContent;
  journalDate: string;
  journalTime: string;
};

export type JournalDraftInput = JournalDraftFields & {
  id: string;
};
