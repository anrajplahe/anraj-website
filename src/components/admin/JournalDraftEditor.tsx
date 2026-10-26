
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useRouter } from "next/navigation";
import type { JournalDraftFields } from "@/types/journal";

import JournalVideoMedia from "./JournalVideoMedia";
import JournalDateTimeFields from "./JournalDateTimeFields";
import JournalRichTextEditor from "./JournalRichTextEditor";

import {
  saveJournalDraft,
  publishJournalDraft,
  discardJournalDraft,
  savePublishedRevision,
  publishPublishedRevision,
  discardPublishedRevision,
  loadJournalEditor,
} from "@/app/admin/posts/actions";

type Props = {
  id: string;
};

type SessionWork = {
  saves: Promise<void>;
  action: Promise<void>;
};

type SessionProps = Props & {
  initial: JournalDraftFields;
  mode: "draft" | "published";
  work: RefObject<SessionWork>;
};

type SaveStatus =
  | "saved"
  | "unsaved"
  | "saving"
  | "error";

export default function JournalDraftEditor({ id }: Props) {
  const { bfcacheId } = useRouter();
  const work = useRef<SessionWork>({
    saves: Promise.resolve(),
    action: Promise.resolve(),
  });
  const generation = useRef(0);
  const [session, setSession] = useState<{
    key: number;
    data: Awaited<ReturnType<typeof loadJournalEditor>>;
  } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Activity runs layout cleanup on hide and setup on re-show. bfcacheId
  // additionally identifies fresh navigations; it does NOT change on Back.
  useLayoutEffect(() => {
    let cancelled = false;

    async function openSession() {
      try {
        // A previous session may have been hidden during a database write.
        // Its final write must settle before reading the replacement session.
        await work.current.action.catch(() => {});
        await work.current.saves.catch(() => {});
        const data = await loadJournalEditor(id);
        if (!cancelled) {
          setLoadError("");
          setSession({ key: ++generation.current, data });
        }
      } catch (cause) {
        if (!cancelled) {
          setLoadError(cause instanceof Error ? cause.message : "Could not load this entry.");
        }
      }
    }

    void openSession();
    return () => {
      cancelled = true;
      // Remove the entire form, including Tiptap, before it can be reused.
      setSession(null);
    };
  }, [id, bfcacheId, attempt]);

  if (!session) {
    return (
      <div className="p-8 text-gray-400" role={loadError ? "alert" : "status"}>
        {loadError || "Loading journal editor..."}
        {loadError && (
          <button type="button" className="ml-3 underline" onClick={() => {
            setLoadError("");
            setAttempt((value) => value + 1);
          }}>Retry</button>
        )}
      </div>
    );
  }

  return <JournalEditorSession key={session.key} id={id} {...session.data} work={work} />;
}

function JournalEditorSession({
  id,
  initial,
  mode,
  work,
}: SessionProps) {
  const router = useRouter();
  const [fields, setFields] = useState(initial);
  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("saved");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Keep the latest values available to async callbacks.
  const latestFields = useRef(initial);
  const lastSaved = useRef(JSON.stringify(initial));

  // Save requests must complete in order.
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  // Stop queued autosaves during publishing or discarding.
  const stopped = useRef(false);
  const active = useRef(false);
  const actionRunning = useRef(false);

  function updateFields(
    changes: Partial<JournalDraftFields>
  ) {
    if (!active.current || stopped.current || actionRunning.current) return;

    const next = {
      ...latestFields.current,
      ...changes,
    };

    latestFields.current = next;
    setFields(next);
    setSaveStatus("unsaved");
  }

const savePending = useCallback(async () => {
  // Add a save operation to the queue.
  const operation = saveQueue.current
    .catch(() => {
      // Allow another attempt after a previous failure.
    })
    .then(async () => {
      if (stopped.current) return;

      // Read the latest fields when this operation runs,
      // not when it was originally queued.
      const snapshot = latestFields.current;
      const serialized = JSON.stringify(snapshot);

      if (serialized === lastSaved.current) {
        return;
      }

      setSaveStatus("saving");

      try {
        if (mode === "published") {
          // Store unpublished edits separately.
          await savePublishedRevision({
            id,
            ...snapshot,
          });
        } else {
          // Save an ordinary unpublished draft.
          await saveJournalDraft({
            id,
            ...snapshot,
          });
        }

        // Only record a successful database save.
        lastSaved.current = serialized;

        const latestSerialized = JSON.stringify(
          latestFields.current
        );

        setSaveStatus(
          serialized === latestSerialized
            ? "saved"
            : "unsaved"
        );

        setError("");
      } catch (cause) {
        setSaveStatus("error");
        throw cause;
      }
    });

  saveQueue.current = operation;
  work.current.saves = operation;

  await operation;
}, [id, mode, work]);

  useLayoutEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      // Preserve edits if navigation hides the editor before its debounce fires.
      // Publish/discard already stop saves and manage their own final write.
      if (!stopped.current) void savePending().catch(() => {});
    };
  }, [savePending]);

  function runAction(action: () => Promise<void>) {
    if (!active.current || actionRunning.current || stopped.current) return;
    actionRunning.current = true;
    work.current.action = action().finally(() => {
      actionRunning.current = false;
    });
  }

  // Autosave shortly after the latest change.
  useEffect(() => {
    if (
      stopped.current || busy ||
      JSON.stringify(fields) === lastSaved.current
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void savePending().catch(() => {
        setError(
          "Autosave failed. Your changes have not all been saved. Please retry."
        );
      });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [fields, savePending, busy]);

  // Warn if the browser is closed before the last save completes.
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (
        !stopped.current &&
        JSON.stringify(latestFields.current) !==
          lastSaved.current
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, []);

  async function saveAndReturn() {
    setBusy(true);
    setError("");

    try {
      await savePending();
      stopped.current = true;

      if (active.current) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError(
        "Could not save your changes. Please retry before leaving."
      );
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!latestFields.current.journalDate) {
      setError("Choose a journal date before publishing.");
      return;
    }

    setBusy(true);
    setError("");
    stopped.current = true;

    try {
      // Let any already-started autosave finish first.
      await saveQueue.current.catch(() => {});

      // Publish includes the latest unsaved field values.
      if (mode === "published") {
        await publishPublishedRevision({
          id,
          ...latestFields.current,
        });
      } else {
        await publishJournalDraft({
          id,
          ...latestFields.current,
        });
      }

      if (active.current) {
        router.replace("/admin");
        router.refresh();
      }
    } catch (cause) {
      stopped.current = false;
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not publish this entry."
      );
    } finally {
      setBusy(false);
    }
  }


async function discard() {
  const message =
    mode === "published"
      ? "Discard your unpublished changes? The published entry will remain unchanged."
      : "Permanently discard this draft? This cannot be undone.";

  const confirmed = window.confirm(message);

  if (!confirmed) return;

  stopped.current = true;
  setBusy(true);
  setError("");

  try {
    // Wait for previously started saves before discarding.
    await saveQueue.current.catch(() => {});

    if (mode === "published") {
      await discardPublishedRevision(id);
    } else {
      await discardJournalDraft(id);
    }

    if (active.current) {
      router.replace("/admin");
      router.refresh();
    }
  } catch {
    stopped.current = false;
    setError(
      mode === "published"
        ? "Could not discard your unpublished changes."
        : "Could not discard this draft."
    );
  } finally {
    setBusy(false);
  }
}


  const savingLabel =
    saveStatus === "saved"
      ? "All changes saved"
      : saveStatus === "saving"
        ? "Saving..."
        : saveStatus === "error"
          ? "Save failed"
          : "Unsaved changes";

  const fieldStyle =
    "w-full rounded-lg border border-white/15 bg-[#161A22] px-4 py-3 text-white focus:border-green-400 focus:outline-none";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      {/* Navigation and save status */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          disabled={busy}
          onClick={() => runAction(saveAndReturn)}
          className="text-sm text-gray-400 transition-colors hover:text-white disabled:opacity-50"
        >
          ← Back to dashboard
        </button>

        <div
          role="status"
          aria-live="polite"
          className={`text-sm ${
            saveStatus === "saved"
              ? "text-green-400"
              : saveStatus === "error"
                ? "text-red-400"
                : "text-gray-400"
          }`}
        >
          {savingLabel}
        </div>
      </div>

      <div className="mb-10">
        <p className="mb-2 text-sm font-medium text-green-400">
          {mode === "published"
            ? "Published · Editing unpublished changes"
            : "Draft"}
        </p>

        <h1 className="text-3xl font-semibold text-white">
          {mode === "published"
            ? "Edit journal entry"
            : "Journal editor"}
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          {mode === "published"
            ? "Your changes are saved automatically but won't appear publicly until you publish them."
            : "Changes are automatically saved while you write."}
        </p>
      </div>

      <div className="space-y-8" inert={busy}>
        {/* Journal selection */}
        <label className="flex flex-col gap-2 text-sm text-gray-400">
          Journal
          <select
            value={fields.category}
            disabled={busy}
            onChange={(event) =>
              updateFields({
                category: event.target.value as
                  | "bhangra"
                  | "music",
              })
            }
            className={fieldStyle}
          >
            <option value="bhangra">Bhangra</option>
            <option value="music">Guitar & Music</option>
          </select>
        </label>

        {/* Optional title */}
        <label className="flex flex-col gap-2 text-sm text-gray-400">
          Title (optional)
          <input
            type="text"
            maxLength={150}
            value={fields.title}
            disabled={busy}
            onChange={(event) =>
              updateFields({ title: event.target.value })
            }
            placeholder="Give your entry a title..."
            className={fieldStyle}
          />
        </label>

        {/* Rich-text editor */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Content</p>

          <JournalRichTextEditor
            initialContent={initial.content}
            onContentChange={(content) =>
              updateFields({ content })
            }
          />
        </div>

        <JournalVideoMedia
          videoUrls={fields.videoUrls}
          onChange={(videoUrls) => updateFields({ videoUrls })}
        />

        {/* Entry settings */}
        <section className="space-y-4 rounded-xl border border-white/10 p-5">
          <h2 className="font-semibold text-white">
            Entry settings
          </h2>

          <JournalDateTimeFields
            journalDate={fields.journalDate}
            journalTime={fields.journalTime}
            onChange={updateFields}
          />

          <p className="text-xs text-gray-500">
            A journal date is required for publishing.
            Drafts can be saved without one.
          </p>
        </section>

        {/* Error feedback */}
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {error}

            {saveStatus === "error" && (
              <button
                type="button"
                onClick={() => {
                  void savePending().catch(() => {});
                }}
                className="ml-3 font-medium underline"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Publishing controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction(discard)}
            className="rounded-lg border border-red-400/40 px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-50"
          >
            {mode === "published"
              ? "Discard changes"
              : "Discard draft"}
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => runAction(saveAndReturn)}
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/50 disabled:opacity-50"
            >
              Save draft
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => runAction(publish)}
              className="rounded-lg bg-green-400 px-6 py-2.5 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-green-300 disabled:opacity-50"
            >
              {mode === "published"
                ? "Publish changes"
                : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
