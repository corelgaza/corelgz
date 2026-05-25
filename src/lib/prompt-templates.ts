export type PromptTone =
  | "friendly-remaja"
  | "formal-edukatif"
  | "story-telling"
  | "motivasi-inspiratif"
  | "ringan-humor";

export type PromptLanguage = "id" | "id-sunda" | "id-jawa";

export type PromptElements = {
  introHook: boolean;
  headings: boolean;
  numberedList: boolean;
  quoteAyatHadits: boolean;
  realExample: boolean;
  conclusion: boolean;
  ctaWhatsApp: boolean;
};

export type PromptInput = {
  title: string;
  audience: string;
  tone: PromptTone;
  language: PromptLanguage;
  wordCount: number;
  outline: string;
  references: string;
  elements: PromptElements;
  format: "markdown" | "plain";
};

const TONE_LABEL: Record<PromptTone, string> = {
  "friendly-remaja":
    "akrab, santai, ala remaja yang cerdas (tapi tetap sopan & berisi)",
  "formal-edukatif":
    "formal, edukatif, mendalam, mirip artikel jurnal populer",
  "story-telling":
    "story-telling, mengalir, banyak narasi pengalaman & dialog",
  "motivasi-inspiratif":
    "menggugah, motivatif, penuh dorongan & semangat positif",
  "ringan-humor":
    "ringan, humoris, banyak metafora & analogi yang lucu tapi tetap bermakna",
};

const LANG_LABEL: Record<PromptLanguage, string> = {
  id: "Bahasa Indonesia",
  "id-sunda": "Bahasa Indonesia dengan sentuhan istilah Sunda yang umum",
  "id-jawa": "Bahasa Indonesia dengan sentuhan istilah Jawa yang umum",
};

export function buildPrompt(input: PromptInput): string {
  const {
    title,
    audience,
    tone,
    language,
    wordCount,
    outline,
    references,
    elements,
    format,
  } = input;

  const outlineBlock = outline.trim()
    ? outline
        .trim()
        .split(/\r?\n/)
        .map((line) => {
          const t = line.trim().replace(/^[-*•\d.)\s]+/, "");
          return t ? `- ${t}` : "";
        })
        .filter(Boolean)
        .join("\n")
    : "- (Bebas, ekspansi alami berdasarkan judul)";

  const refsBlock = references.trim()
    ? references
        .trim()
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `- ${l.replace(/^[-*•\s]+/, "")}`)
        .join("\n")
    : "- (Tidak ada referensi spesifik; pakai pengetahuan umum yang terpercaya. JANGAN halusinasi nama kitab/ayat/hadits.)";

  const elementList: string[] = [];
  if (elements.introHook)
    elementList.push(
      "Pembuka dengan **hook** yang nendang (pertanyaan, fakta unik, atau cerita pendek 2-3 kalimat)."
    );
  if (elements.headings)
    elementList.push(
      "Gunakan struktur heading bertingkat: **H2** untuk bagian utama dan **H3** untuk sub-bagian."
    );
  if (elements.numberedList)
    elementList.push(
      "Sertakan minimal satu daftar bernomor atau bullet poin untuk meringkas hal penting."
    );
  if (elements.quoteAyatHadits)
    elementList.push(
      "Kutip ayat Al-Quran atau hadits yang relevan **HANYA** kalau yakin akurat. Sertakan sumber (surat & ayat / perawi). Lebih baik tanpa kutipan daripada salah."
    );
  if (elements.realExample)
    elementList.push(
      "Berikan contoh nyata/anekdot kehidupan santri (tanpa menyebut nama spesifik orang yang sensitif)."
    );
  if (elements.conclusion)
    elementList.push(
      "Tutup dengan kesimpulan padat 3-4 kalimat + 1 pesan utama yang dibawa pulang pembaca."
    );
  if (elements.ctaWhatsApp)
    elementList.push(
      "Tambahkan ajakan halus di akhir untuk berdiskusi via kontak di situs (jangan hard-sell)."
    );

  const elementsBlock = elementList.length
    ? elementList.map((s) => `- ${s}`).join("\n")
    : "- Bebas, asal koheren dan informatif.";

  const formatBlock =
    format === "markdown"
      ? `Tulis **dalam format Markdown**. Strukturnya:
- Diawali baris **EXCERPT:** lalu 1-2 kalimat ringkasan untuk preview kartu (jangan ditulis ulang di body).
- Lalu paragraf-paragraf artikel dengan heading H2/H3 (tanpa H1, karena judul sudah ditangani sistem).
- Akhiri dengan baris kosong (jangan tanda tangan).`
      : `Tulis sebagai teks biasa (plain text). Tetap jelaskan strukturnya secara natural lewat paragraf dan baris kosong di antara bagian.`;

  return `# PERAN
Kamu adalah penulis konten profesional untuk situs Santri Journey — portfolio santri Pondok Pesantren Sukahideng (Tasikmalaya). Audiens situs adalah anak muda yang penasaran dengan kehidupan pesantren modern. Kamu memahami konteks pesantren tradisional Indonesia (NU, salafiyah, halaqah, ngaji kitab kuning) dan menghindari menggurui.

# TUGAS
Tulis sebuah artikel lengkap dengan judul: **"${title || "(isi judul dulu di editor)"}"**

# KONTEKS PEMBACA & GAYA
- Audiens target: ${audience || "santri SMP-SMA & calon santri yang penasaran"}
- Tone: ${TONE_LABEL[tone]}
- Bahasa: ${LANG_LABEL[language]}
- Panjang ideal: sekitar **${wordCount} kata** (toleransi ±15%)

# OUTLINE / POIN YANG WAJIB DIBAHAS
${outlineBlock}

# REFERENSI / SUMBER YANG BISA DIPAKAI
${refsBlock}

# ELEMEN WAJIB DI ARTIKEL
${elementsBlock}

# FORMAT OUTPUT
${formatBlock}

# CONSTRAINT PENTING (JANGAN LANGGAR)
- **Jangan halusinasi**: jika tidak yakin sumber/nama/angka, gunakan bahasa hati-hati ("menurut sebagian ulama...", "diperkirakan...") atau abaikan.
- Hindari klaim sektarian/menyerang aliran lain. Bersikap netral & toleran.
- Hindari kalimat AI-cliche seperti "Di dunia yang serba cepat ini", "Mari kita selami", "Pada hakikatnya". Tulis seperti manusia.
- Jangan pakai emoji berlebihan; maksimal 2-3 di seluruh artikel, ditempatkan natural.
- Jangan tutup dengan kalimat AI seperti "Semoga artikel ini bermanfaat" — buatlah penutup yang reflektif dan personal.

# OUTPUT
Mulai langsung dari baris EXCERPT (atau paragraf pembuka jika plain text). Jangan tulis ulang instruksi ini.`;
}
