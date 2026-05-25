"use client";

import { useState } from "react";
import {
  buildPrompt,
  type PromptElements,
  type PromptInput,
  type PromptLanguage,
  type PromptTone,
} from "@/lib/prompt-templates";

const DEFAULT_ELEMENTS: PromptElements = {
  introHook: true,
  headings: true,
  numberedList: true,
  quoteAyatHadits: false,
  realExample: true,
  conclusion: true,
  ctaWhatsApp: false,
};

const TONE_OPTIONS: Array<{ value: PromptTone; label: string }> = [
  { value: "friendly-remaja", label: "Friendly santai ala remaja" },
  { value: "formal-edukatif", label: "Formal & edukatif" },
  { value: "story-telling", label: "Story-telling / naratif" },
  { value: "motivasi-inspiratif", label: "Motivasi & inspiratif" },
  { value: "ringan-humor", label: "Ringan & humoris" },
];

const LANG_OPTIONS: Array<{ value: PromptLanguage; label: string }> = [
  { value: "id", label: "Indonesia" },
  { value: "id-sunda", label: "Indonesia + nuansa Sunda" },
  { value: "id-jawa", label: "Indonesia + nuansa Jawa" },
];

const WORD_OPTIONS = [500, 800, 1200, 2000];

export default function PromptGenerator({ title }: { title: string }) {
  const [audience, setAudience] = useState(
    "Santri SMP-SMA & calon santri yang penasaran kehidupan pesantren"
  );
  const [tone, setTone] = useState<PromptTone>("friendly-remaja");
  const [language, setLanguage] = useState<PromptLanguage>("id");
  const [wordCount, setWordCount] = useState(800);
  const [outline, setOutline] = useState("");
  const [references, setReferences] = useState("");
  const [elements, setElements] = useState<PromptElements>(DEFAULT_ELEMENTS);
  const [format, setFormat] = useState<"markdown" | "plain">("markdown");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const input: PromptInput = {
      title,
      audience,
      tone,
      language,
      wordCount,
      outline,
      references,
      elements,
      format,
    };
    setOutput(buildPrompt(input));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const toggleEl = (key: keyof PromptElements) =>
    setElements((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="admin-prompt-card">
      <h2>Prompt Generator</h2>
      <p className="muted">
        Isi parameter, lalu copy prompt-nya ke ChatGPT / Gemini. Hasil artikel
        tinggal di-paste ke editor.
      </p>

      <div className="admin-field">
        <label className="admin-label">Target pembaca</label>
        <input
          className="admin-input"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>

      <div className="admin-field-row">
        <div>
          <label className="admin-label">Tone</label>
          <select
            className="admin-select"
            value={tone}
            onChange={(e) => setTone(e.target.value as PromptTone)}
          >
            {TONE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Panjang (kata)</label>
          <select
            className="admin-select"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
          >
            {WORD_OPTIONS.map((w) => (
              <option key={w} value={w}>
                ~{w}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-field-row">
        <div>
          <label className="admin-label">Bahasa</label>
          <select
            className="admin-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as PromptLanguage)}
          >
            {LANG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="admin-label">Format output</label>
          <select
            className="admin-select"
            value={format}
            onChange={(e) =>
              setFormat(e.target.value === "plain" ? "plain" : "markdown")
            }
          >
            <option value="markdown">Markdown (rekomendasi)</option>
            <option value="plain">Plain text</option>
          </select>
        </div>
      </div>

      <div className="admin-field">
        <label className="admin-label">Outline / poin wajib (opsional)</label>
        <textarea
          className="admin-textarea"
          rows={4}
          placeholder={"Pisahkan per baris, mis:\n- Sejarah ngaji kitab\n- Manfaat bagi santri modern"}
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label className="admin-label">
          Referensi ayat/hadits/kitab (opsional)
        </label>
        <textarea
          className="admin-textarea"
          rows={3}
          placeholder={"Mis: QS Al-Mujadilah ayat 11, Hadits Bukhari no. 71"}
          value={references}
          onChange={(e) => setReferences(e.target.value)}
        />
      </div>

      <div className="admin-field">
        <label className="admin-label">Elemen wajib di artikel</label>
        <div className="admin-checkbox-grid">
          <label>
            <input
              type="checkbox"
              checked={elements.introHook}
              onChange={() => toggleEl("introHook")}
            />
            Hook pembuka
          </label>
          <label>
            <input
              type="checkbox"
              checked={elements.headings}
              onChange={() => toggleEl("headings")}
            />
            Heading H2/H3
          </label>
          <label>
            <input
              type="checkbox"
              checked={elements.numberedList}
              onChange={() => toggleEl("numberedList")}
            />
            Daftar / bullet
          </label>
          <label>
            <input
              type="checkbox"
              checked={elements.quoteAyatHadits}
              onChange={() => toggleEl("quoteAyatHadits")}
            />
            Kutipan ayat/hadits
          </label>
          <label>
            <input
              type="checkbox"
              checked={elements.realExample}
              onChange={() => toggleEl("realExample")}
            />
            Contoh nyata
          </label>
          <label>
            <input
              type="checkbox"
              checked={elements.conclusion}
              onChange={() => toggleEl("conclusion")}
            />
            Kesimpulan
          </label>
          <label>
            <input
              type="checkbox"
              checked={elements.ctaWhatsApp}
              onChange={() => toggleEl("ctaWhatsApp")}
            />
            CTA kontak
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        className="admin-btn admin-btn-gold admin-btn-block"
        disabled={!title.trim()}
        title={!title.trim() ? "Isi judul artikel dulu" : undefined}
      >
        ✨ Generate Prompt
      </button>

      {output && (
        <>
          <div style={{ marginTop: "1rem" }} className="admin-prompt-output">
            <textarea readOnly value={output} />
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 6,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={handleCopy}
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              {copied ? "✓ Tersalin!" : "Copy Prompt"}
            </button>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--admin-text-muted)",
              }}
            >
              {output.length.toLocaleString("id-ID")} karakter
            </span>
          </div>
          <div className="admin-quick-links">
            <a
              href="https://chat.openai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-quick-link"
            >
              Buka ChatGPT ↗
            </a>
            <a
              href="https://gemini.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-quick-link"
            >
              Buka Gemini ↗
            </a>
          </div>
        </>
      )}
    </div>
  );
}
