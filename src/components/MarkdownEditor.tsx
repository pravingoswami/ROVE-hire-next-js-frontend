"use client";

import { useRef, useState } from "react";

import { MarkdownContent } from "@/components/MarkdownContent";

interface MarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}

type Tab = "write" | "preview";

function wrapSelection(
  textarea: HTMLTextAreaElement,
  current: string,
  before: string,
  after: string,
  fallback: string
): string {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = current.slice(start, end) || fallback;
  return current.slice(0, start) + before + selected + after + current.slice(end);
}

function prefixLines(
  textarea: HTMLTextAreaElement,
  current: string,
  prefix: string,
  ordered = false
): string {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const block = current.slice(start, end) || "List item";
  const lines = block.split("\n");
  const formatted = lines
    .map((line, i) => {
      const trimmed = line.replace(/^[-*]\s+|^\d+\.\s+/, "");
      return ordered ? `${i + 1}. ${trimmed}` : `${prefix}${trimmed}`;
    })
    .join("\n");
  return current.slice(0, start) + formatted + current.slice(end);
}

export function MarkdownEditor({
  id = "description",
  value,
  onChange,
  required,
  minLength,
  placeholder = "Write the job description using markdown…",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<Tab>("write");

  function applyTransform(transform: (ta: HTMLTextAreaElement, current: string) => string) {
    const ta = textareaRef.current;
    if (!ta) return;
    onChange(transform(ta, value));
    ta.focus();
  }

  const toolbar = [
    {
      label: "B",
      title: "Bold",
      action: () =>
        applyTransform((ta, cur) => wrapSelection(ta, cur, "**", "**", "bold text")),
    },
    {
      label: "I",
      title: "Italic",
      action: () =>
        applyTransform((ta, cur) => wrapSelection(ta, cur, "*", "*", "italic text")),
    },
    {
      label: "H",
      title: "Heading",
      action: () =>
        applyTransform((ta, cur) => {
          const start = ta.selectionStart;
          const lineStart = cur.lastIndexOf("\n", start - 1) + 1;
          return cur.slice(0, lineStart) + "## " + cur.slice(lineStart);
        }),
    },
    {
      label: "•",
      title: "Bullet list",
      action: () =>
        applyTransform((ta, cur) => prefixLines(ta, cur, "- ")),
    },
    {
      label: "1.",
      title: "Numbered list",
      action: () =>
        applyTransform((ta, cur) => prefixLines(ta, cur, "", true)),
    },
    {
      label: "Link",
      title: "Link",
      action: () =>
        applyTransform((ta, cur) => wrapSelection(ta, cur, "[", "](https://)", "link text")),
    },
  ];

  return (
    <div className="markdown-editor">
      <div className="markdown-editor-toolbar">
        <div className="markdown-editor-actions">
          {toolbar.map((item) => (
            <button
              key={item.title}
              type="button"
              className="markdown-editor-btn"
              title={item.title}
              onClick={item.action}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="markdown-editor-tabs">
          <button
            type="button"
            className={tab === "write" ? "active" : ""}
            onClick={() => setTab("write")}
          >
            Write
          </button>
          <button
            type="button"
            className={tab === "preview" ? "active" : ""}
            onClick={() => setTab("preview")}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          id={id}
          className="markdown-editor-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          rows={12}
        />
      ) : (
        <div className="markdown-editor-preview">
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="empty">Nothing to preview yet.</p>
          )}
        </div>
      )}

      <p className="markdown-editor-hint">
        Supports **bold**, *italic*, headings, bullet lists, numbered lists, and links.
      </p>
    </div>
  );
}
