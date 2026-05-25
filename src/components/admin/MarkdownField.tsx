"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          padding: "1rem",
          border: "1px solid var(--admin-border)",
          borderRadius: 8,
          background: "#fafafa",
          fontSize: "0.85rem",
          color: "var(--admin-text-muted)",
        }}
      >
        Memuat editor markdown...
      </div>
    ),
  }
);

export default function MarkdownField({
  value,
  onChange,
  height = 480,
}: {
  value: string;
  onChange: (v: string) => void;
  height?: number;
}) {
  return (
    <div className="admin-markdown-editor" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={height}
        preview="live"
        textareaProps={{
          placeholder:
            "Tulis artikel dalam Markdown. Gunakan ## untuk heading, **bold**, dst.",
        }}
      />
    </div>
  );
}
