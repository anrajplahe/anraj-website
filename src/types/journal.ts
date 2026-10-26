import type { JSONContent } from "@tiptap/core";

import type { MediaReference } from "@/lib/journal/media";
import type { JournalImage } from "@/lib/journal/images";

export type JournalDraftFields = {
  images: JournalImage[];
  mediaOrder: MediaReference[];
  coverImageId: string | null;
  videoUrls: string[];
  category: "bhangra" | "music";
  title: string;
  content: JSONContent;
  journalDate: string;
  journalTime: string;
};

export type JournalDraftInput = JournalDraftFields & {
  id: string;
  version: string;
};
