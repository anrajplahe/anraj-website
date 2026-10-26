
"use client";

import { useRef, useState } from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

// Allow manually applied links to continue across spaces.
const ManualLink = Link.extend({
  inclusive: true,
});

const emptyDocument: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

type Props = {
  initialContent?: JSONContent;
  onContentChange?: (content: JSONContent) => void;
};

export default function JournalRichTextEditor({
  initialContent = emptyDocument,
  onContentChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Link editor state
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  // Remember the selected text while editing a URL
  const linkSelection = useRef<{
    from: number;
    to: number;
  } | null>(null);

  // Initialise Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        code: false,

        // Use our custom Link extension instead.
        link: false,
      }),

      ManualLink.configure({
        openOnClick: false,

        // Prevent automatic URL detection from interfering
        // with manually applied hyperlinks.
        autolink: false,

        linkOnPaste: false,

        // Only allow safe HTTP and HTTPS links.
        isAllowedUri: (url, context) =>
          context.defaultValidate(url) &&
          /^https?:\/\//i.test(url),
      }),
    ],

    content: initialContent,
    immediatelyRender: false,

    editorProps: {
      attributes: {
        "aria-label": "Journal entry content",
      },
    },

    // Populate the hidden field when the editor is created.
    onCreate: ({ editor }) => {
      if (inputRef.current) {
        inputRef.current.value = JSON.stringify(
          editor.getJSON()
        );
      }
    },

    // Keep the hidden field updated as content changes.
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();

      if (inputRef.current) {
        inputRef.current.value = JSON.stringify(content);
      }

      onContentChange?.(content);
    },
  });

  // Track active formatting at the cursor or selection.
  const editorState = useEditorState({
    editor,

    selector: ({ editor: currentEditor }) => ({
      bold: currentEditor?.isActive("bold") ?? false,
      italic: currentEditor?.isActive("italic") ?? false,
      underline:
        currentEditor?.isActive("underline") ?? false,
      strike: currentEditor?.isActive("strike") ?? false,
      bulletList:
        currentEditor?.isActive("bulletList") ?? false,
      orderedList:
        currentEditor?.isActive("orderedList") ?? false,
      link: currentEditor?.isActive("link") ?? false,
    }),
  });

  // Open the link editor while retaining the text selection.
  function openLinkEditor() {
    if (!editor) return;

    const { from, to } = editor.state.selection;

    linkSelection.current = { from, to };

    const currentHref = editor.getAttributes("link").href;

    setLinkUrl(
      typeof currentHref === "string" ? currentHref : ""
    );

    setLinkError("");
    setLinkOpen(true);
  }

  // Close the link editor.
  function closeLinkEditor() {
    setLinkOpen(false);
    setLinkError("");
    linkSelection.current = null;
  }

  // Validate and apply a hyperlink.
  function applyLink() {
    if (!editor) return;

    const value = linkUrl.trim();

    if (!value) {
      setLinkError("Please enter a URL.");
      return;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(value);
    } catch {
      setLinkError(
        "Enter a valid URL beginning with https:// or http://"
      );
      return;
    }

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      !parsedUrl.hostname
    ) {
      setLinkError(
        "Only HTTP and HTTPS links are supported."
      );
      return;
    }

    // Restore the original selection.
    const chain = editor.chain().focus();

    if (linkSelection.current) {
      chain.setTextSelection(linkSelection.current);
    }

    const applied = chain
      .extendMarkRange("link")
      .setLink({ href: parsedUrl.toString() })
      .run();

    if (!applied) {
      setLinkError("Unable to apply this link.");
      return;
    }

    closeLinkEditor();
  }

  // Toolbar buttons
  const toolbarActions = editor
    ? [
        {
          label: "Bold",
          display: <strong>B</strong>,
          active: editorState?.bold ?? false,
          action: () =>
            editor.chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          display: <em>I</em>,
          active: editorState?.italic ?? false,
          action: () =>
            editor.chain().focus().toggleItalic().run(),
        },
        {
          label: "Underline",
          display: <u>U</u>,
          active: editorState?.underline ?? false,
          action: () =>
            editor.chain().focus().toggleUnderline().run(),
        },
        {
          label: "Strikethrough",
          display: <s>S</s>,
          active: editorState?.strike ?? false,
          action: () =>
            editor.chain().focus().toggleStrike().run(),
        },
        {
          label: "Bullet list",
          display: "• List",
          active: editorState?.bulletList ?? false,
          action: () =>
            editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "Numbered list",
          display: "1. List",
          active: editorState?.orderedList ?? false,
          action: () =>
            editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: "Link",
          display: "Link",
          active: editorState?.link ?? false,
          action: openLinkEditor,
        },

        // Show End link immediately after Link when
        // the cursor is inside linked text.
        ...(editorState?.link &&
        editor.state.selection.empty &&
        !linkOpen
          ? [
              {
                label: "End link",
                display: "End link",
                active: null,
                action: () =>
                  editor
                    .chain()
                    .focus()
                    .unsetMark("link")
                    .run(),
              },
            ]
          : []),

        {
          label: "Undo",
          display: "Undo",
          active: null,
          action: () =>
            editor.chain().focus().undo().run(),
        },
        {
          label: "Redo",
          display: "Redo",
          active: null,
          action: () =>
            editor.chain().focus().redo().run(),
        },
      ]
    : [];

  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#161A22] focus-within:border-green-400">

      {/* Hidden input submitted with the parent form */}
      <input
        ref={inputRef}
        type="hidden"
        name="content"
        defaultValue={JSON.stringify(initialContent)}
      />

      {/* Formatting toolbar */}
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex flex-wrap gap-1 border-b border-white/10 p-2"
      >
        {toolbarActions.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            aria-label={item.label}
            aria-pressed={
              item.active === null
                ? undefined
                : item.active
            }
            aria-expanded={
              item.label === "Link"
                ? linkOpen
                : undefined
            }
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={item.action}
            className={`
              rounded-md border px-3 py-2 text-sm
              font-medium transition-colors
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-green-400
              ${
                item.active
                  ? "border-green-400/60 bg-green-400/15 text-green-300"
                  : item.label === "End link"
                    ? "border-green-400/40 text-green-300 hover:bg-green-400/10"
                    : "border-transparent text-gray-300 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {item.display}
          </button>
        ))}
      </div>

      {/* Inline link editor */}
      {linkOpen && (
        <div
          role="group"
          aria-label="Insert or edit link"
          className="space-y-3 border-b border-white/10 bg-[#1B202B] p-4"
        >
          <label
            htmlFor="journal-link-url"
            className="block text-sm font-medium text-gray-300"
          >
            Link URL
          </label>

          <input
            id="journal-link-url"
            type="url"
            value={linkUrl}
            onChange={(event) => {
              setLinkUrl(event.target.value);
              setLinkError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }

              if (event.key === "Escape") {
                event.preventDefault();
                closeLinkEditor();
                editor?.commands.focus();
              }
            }}
            placeholder="https://example.com"
            aria-invalid={Boolean(linkError)}
            aria-describedby={
              linkError
                ? "journal-link-error"
                : undefined
            }
            className={`w-full rounded-lg border bg-[#0B0D14] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none ${
              linkError
                ? "border-red-400"
                : "border-white/15 focus:border-green-400"
            }`}
          />

          {/* Validation error */}
          {linkError && (
            <p
              id="journal-link-error"
              role="alert"
              className="text-sm text-red-400"
            >
              {linkError}
            </p>
          )}

          {/* Link actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={applyLink}
              className="rounded-lg bg-green-400 px-4 py-2 text-sm font-semibold text-[#0B0D14] transition-colors hover:bg-green-300"
            >
              Apply link
            </button>

            <button
              type="button"
              onClick={() => {
                closeLinkEditor();
                editor?.commands.focus();
              }}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/40 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Rich-text writing area */}
      <EditorContent
        editor={editor}
        className="
          text-sm text-white
          [&_.tiptap]:min-h-[240px]
          [&_.tiptap]:px-4
          [&_.tiptap]:py-3
          [&_.tiptap]:outline-none
          [&_.tiptap_p]:my-2
          [&_.tiptap_ul]:list-disc
          [&_.tiptap_ul]:pl-6
          [&_.tiptap_ol]:list-decimal
          [&_.tiptap_ol]:pl-6
          [&_.tiptap_a]:text-green-400
          [&_.tiptap_a]:underline
          [&_.tiptap_u]:underline
          [&_.tiptap_s]:line-through
        "
      />
    </div>
  );
}
