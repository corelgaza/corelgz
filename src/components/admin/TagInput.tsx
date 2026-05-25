"use client";

import { useState } from "react";

export default function TagInput({
  value,
  onChange,
  placeholder = "Ketik lalu tekan Enter atau koma",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const commit = (raw: string) => {
    const clean = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!clean) return;
    if (value.includes(clean)) return;
    if (value.length >= 12) return;
    onChange([...value, clean]);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeAt = (i: number) =>
    onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="admin-tag-input">
      {value.map((tag, i) => (
        <span key={tag} className="admin-tag">
          {tag}
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label={`Hapus tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        placeholder={value.length === 0 ? placeholder : ""}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => commit(draft)}
      />
    </div>
  );
}
