"use client";

import type { ReactNode, Ref } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { moveMedia } from "@/lib/journal/media";
import type { JournalDraftFields } from "@/types/journal";
import type { JournalImage } from "@/lib/journal/images";
import JournalImageMedia, { JournalImageCard, type ImageUploadController } from "./JournalImageMedia";
import JournalVideoMedia, { JournalVideoPreview } from "./JournalVideoMedia";

type Props = {
  postId: string;
  fields: JournalDraftFields;
  controller: Ref<ImageUploadController>;
  onChange: (changes: Partial<JournalDraftFields>) => void;
  onImagesChange: (update: (images: JournalImage[]) => JournalImage[]) => void;
};

function SortableMedia({ id, index, label, children }: { id: string; index: number; label: string; children: ReactNode }) {
  const { ref, handleRef, isDragging } = useSortable({ id, index, type: "journal-media", accept: "journal-media" });
  return (
    <li ref={ref} className={`min-w-0 rounded-lg border p-3 ${isDragging ? "border-blue-500 bg-[#0B0D14]" : "border-white/10"}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400">{index + 1}. {label}</span>
        <button ref={handleRef} type="button" aria-label={`Reorder ${label.toLowerCase()} ${index + 1}`} aria-describedby="journal-media-sort-help"
          className="touch-none cursor-grab rounded border border-white/15 px-3 py-2 text-sm text-gray-300 hover:border-blue-500 hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500 active:cursor-grabbing">
          <span aria-hidden="true">⠿</span> Drag
        </button>
      </div>
      {children}
    </li>
  );
}

export default function JournalMediaEditor({ postId, fields, controller, onChange, onImagesChange }: Props) {
  return (
    <JournalVideoMedia videoUrls={fields.videoUrls} onChange={(videoUrls) => onChange({ videoUrls })} hidePreviews>
      <JournalImageMedia postId={postId} images={fields.images} controller={controller} onChange={onImagesChange} hideAttached />
      <div className="space-y-4 border-t border-white/10 pt-5">
        <h3 className="text-sm font-semibold text-white">Media order</h3>
        <p id="journal-media-sort-help" className="text-xs text-gray-400">Use the drag handles to reorder images and videos. Keyboard: focus a handle, press Space to pick up, use arrow keys to move, then Space to drop or Escape to cancel.</p>
        <p className="text-xs text-gray-400">Choose an image as the cover. Removing the cover clears the selection. Media changes save automatically and appear publicly when published.</p>
        <DragDropProvider onDragEnd={(event) => {
          if (event.canceled) return;
          const { source } = event.operation;
          if (!isSortable(source)) return;
          const next = moveMedia(fields.mediaOrder, String(source.id), source.index);
          if (next !== fields.mediaOrder) onChange({ mediaOrder: next });
        }}>
          <ol className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {fields.mediaOrder.map((ref, index) => {
              const image = ref.type === "image" ? fields.images.find((item) => item.id === ref.id) : undefined;
              return (
                <SortableMedia key={ref.id} id={ref.id} index={index} label={ref.type === "image" ? "Image" : "YouTube video"}>
                  {ref.type === "image" && image && <JournalImageCard image={image} onChange={onImagesChange}
                    isCover={fields.coverImageId === image.id}
                    onCover={() => onChange({ coverImageId: fields.coverImageId === image.id ? null : image.id })} />}
                  {ref.type === "video_embed" && <JournalVideoPreview videoUrl={ref.url} index={index}
                    onRemove={() => onChange({ videoUrls: fields.videoUrls.filter((url) => url !== ref.url) })} />}
                </SortableMedia>
              );
            })}
          </ol>
        </DragDropProvider>
        {!fields.mediaOrder.length && <p className="text-sm text-gray-500">No media attached. Images and videos are optional.</p>}
      </div>
    </JournalVideoMedia>
  );
}
