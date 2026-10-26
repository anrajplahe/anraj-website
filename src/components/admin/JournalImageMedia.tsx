"use client";

import { useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from "react";
import { uploadPresigned } from "@vercel/blob/client";
import { finaliseJournalImage, prepareJournalImage } from "@/app/admin/posts/image-actions";
import { MAX_JOURNAL_IMAGES, validateImageFile, type JournalImage } from "@/lib/journal/images";

export type ImageUploadController = {
  settle: () => Promise<void>;
  hasPending: () => boolean;
};
function resultValue<T>(result: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

type Task = {
  key: string;
  file: File;
  preview: string;
  progress: number;
  state: "uploading" | "verifying" | "error";
  message: string;
  prepared?: { id: string; pathname: string };
  uploaded?: boolean;
  abort: AbortController;
};
type Props = {
  hideAttached?: boolean;
  images: JournalImage[];
  postId: string;
  controller: Ref<ImageUploadController>;
  onChange: (update: (images: JournalImage[]) => JournalImage[]) => void;
};

export default function JournalImageMedia({ images, postId, controller, onChange, hideAttached = false }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksRef = useRef<Task[]>([]);
  const promises = useRef(new Map<string, Promise<void>>());
  const alive = useRef(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  function sync() { if (alive.current) setTasks([...tasksRef.current]); }
  function removeTask(task: Task) {
    task.abort.abort();
    URL.revokeObjectURL(task.preview);
    tasksRef.current = tasksRef.current.filter((item) => item !== task);
    sync();
  }
  useLayoutEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      for (const task of tasksRef.current) {
        task.abort.abort();
        URL.revokeObjectURL(task.preview);
      }
    };
  }, []);

  useImperativeHandle(controller, () => ({
    hasPending: () => tasksRef.current.length > 0,
    settle: async () => {
      await Promise.all([...promises.current.values()]);
      if (tasksRef.current.length) throw new Error("Some images could not be uploaded. Retry or remove them before saving or publishing.");
    },
  }));

  function start(task: Task) {
    task.abort = new AbortController();
    task.state = task.uploaded ? "verifying" : "uploading";
    task.message = "";
    sync();
    const operation = (async () => {
      try {
        // After an uncertain network failure, first check whether Blob received it.
        if (task.prepared && !task.uploaded) {
          try {
            const image = resultValue(await finaliseJournalImage(postId, task.prepared.id));
            if (alive.current && !task.abort.signal.aborted) {
              onChange((current) => [...current, image]);
              removeTask(task);
            }
            return;
          } catch {
            // Use a fresh immutable path for a genuine upload retry.
            task.prepared = undefined;
          }
        }
        if (!task.uploaded) {
          task.prepared = resultValue(await prepareJournalImage(postId, { name: task.file.name, type: task.file.type, size: task.file.size }));
          if (!alive.current || task.abort.signal.aborted) return;
          try {
            await uploadPresigned(task.prepared.pathname, task.file, {
              access: "public",
              contentType: task.file.type,
              handleUploadUrl: "/api/journal/images/upload",
              clientPayload: JSON.stringify({ id: task.prepared.id, postId }),
              abortSignal: task.abort.signal,
              onUploadProgress: ({ percentage }) => { task.progress = percentage; sync(); },
            });
          } catch {
            // SDK failures can contain request details. Never display raw storage
            // errors or signed URLs; server issuance failures have safe diagnostics.
            throw new Error("Image transfer failed. Retry the upload. If it persists, check the server's [journal-image] upload diagnostic.");
          }
          task.uploaded = true;
        }
        if (!alive.current || task.abort.signal.aborted) return;
        task.state = "verifying";
        sync();
        const image = resultValue(await finaliseJournalImage(postId, task.prepared!.id));
        if (!alive.current || task.abort.signal.aborted) return;
        onChange((current) => [...current, image]);
        removeTask(task);
      } catch (cause) {
        if (!alive.current || task.abort.signal.aborted) return;
        task.state = "error";
        task.message = cause instanceof Error ? cause.message : "Upload failed. Retry this image.";
        sync();
      }
    })();
    promises.current.set(task.key, operation);
    void operation.finally(() => { if (promises.current.get(task.key) === operation) promises.current.delete(task.key); });
  }

  function addFiles(files: FileList | File[]) {
    const errors: string[] = [];
    let count = images.length + tasksRef.current.length;
    for (const file of Array.from(files)) {
      try {
        validateImageFile(file);
        if (count >= MAX_JOURNAL_IMAGES) throw new Error(`Use at most ${MAX_JOURNAL_IMAGES} images per entry.`);
        const task: Task = {
          key: crypto.randomUUID(), file, preview: URL.createObjectURL(file), progress: 0,
          state: "uploading", message: "", abort: new AbortController(),
        };
        tasksRef.current.push(task);
        count++;
        start(task);
      } catch (cause) {
        errors.push(`${file.name}: ${cause instanceof Error ? cause.message : "Invalid image."}`);
      }
    }
    setError(errors.join("\n"));
    sync();
  }

  return (
    <div className="space-y-4 border-t border-white/10 pt-5">
      <h3 className="text-sm font-semibold text-white">Images</h3>
      <div
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
        className={`rounded-lg border border-dashed p-5 text-center ${dragging ? "border-green-400 bg-green-400/10" : "border-white/20"}`}
      >
        <p className="mb-3 text-sm text-gray-400">Drop JPG, PNG or WebP images here. Maximum 10 MB per image.</p>
        <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" aria-label="Select journal images"
          onChange={(event) => { if (event.target.files) addFiles(event.target.files); event.target.value = ""; }} />
        <button type="button" onClick={() => input.current?.click()} className="rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-[#0B0D14] hover:bg-green-300">Choose images</button>
      </div>
      <p className="text-xs text-gray-400">Images, captions and alternative text save automatically. Removing an image takes effect publicly when you publish changes.</p>
      {error && <p role="alert" className="whitespace-pre-line text-sm text-red-400">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {!hideAttached && images.map((image) => <JournalImageCard key={image.id} image={image} onChange={onChange} />)}
        {tasks.map((task) => (
          <div key={task.key} className="space-y-3 rounded-lg border border-white/15 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={task.preview} alt="Image awaiting upload verification" className="aspect-video w-full rounded object-contain" />
            <p className="break-all text-xs text-gray-400">{task.file.name}</p>
            {task.state === "uploading" && <progress aria-label={`Uploading ${task.file.name}`} max={100} value={task.progress} className="w-full accent-green-400" />}
            <p role={task.state === "error" ? "alert" : "status"} className={`text-sm ${task.state === "error" ? "text-red-400" : "text-gray-400"}`}>
              {task.state === "error" ? task.message : task.state === "verifying" ? "Verifying image…" : `Uploading ${Math.round(task.progress)}%`}
            </p>
            {task.state === "error" && <button type="button" onClick={() => start(task)} className="mr-4 text-sm text-green-400 underline">{task.uploaded ? "Retry verification" : "Retry upload"}</button>}
            <button type="button" onClick={() => removeTask(task)} className="text-sm text-red-300">{task.state === "error" ? "Remove failed image" : "Cancel upload"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JournalImageCard({ image, onChange, isCover = false, onCover }: {
  image: JournalImage;
  onChange: Props["onChange"];
  isCover?: boolean;
  onCover?: () => void;
}) {
  const fieldStyle = "w-full rounded-lg border border-white/15 bg-[#0B0D14] px-3 py-2 text-sm text-white focus:border-green-400 focus:outline-none";
  return (
    <div className="space-y-3 rounded-lg border border-white/15 p-3">
      {/* Blob URLs are resolved and verified by the server. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={image.altText} className="aspect-video w-full rounded bg-[#0B0D14] object-contain" />
      <label className="block space-y-1 text-xs text-gray-400"><span>Caption</span>
        <textarea value={image.caption} maxLength={2000} className={fieldStyle} onChange={(event) => {
          const caption = event.target.value;
          onChange((current) => current.map((item) => item.id === image.id ? { ...item, caption } : item));
        }} />
      </label>
      <label className="block space-y-1 text-xs text-gray-400"><span>Alternative text</span>
        <input value={image.altText} maxLength={1000} className={fieldStyle} onChange={(event) => {
          const altText = event.target.value;
          onChange((current) => current.map((item) => item.id === image.id ? { ...item, altText } : item));
        }} />
      </label>
      <div className="flex items-center gap-3">
        {isCover && <span className="rounded bg-green-400/15 px-2 py-1 text-xs font-semibold text-green-400">Cover</span>}
        {onCover && <button type="button" aria-pressed={isCover} onClick={onCover} className="text-sm text-green-400 hover:text-green-300">{isCover ? "Clear cover" : "Set as cover"}</button>}
      </div>
      <button type="button" onClick={() => onChange((current) => current.filter((item) => item.id !== image.id))} aria-label="Remove image" className="text-sm text-red-300 hover:text-red-200">Remove image</button>
    </div>
  );
}
