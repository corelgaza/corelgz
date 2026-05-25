/**
 * Menjalankan supabase/schema.sql ke project Supabase.
 *
 * Butuh salah satu di .env.local:
 * - SUPABASE_ACCESS_TOKEN  (Dashboard → Account → Access Tokens)
 * - SUPABASE_DB_PASSWORD   (Dashboard → Settings → Database → password)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(root, file);
    if (!existsSync(path)) continue;
    const lines = readFileSync(path, "utf8").split("\n");
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      const val = t.slice(i + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

loadEnv();

const PROJECT_REF =
  process.env.SUPABASE_PROJECT_REF ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/
  )?.[1];

const sqlPath = resolve(root, "supabase", "schema.sql");
const sql = readFileSync(sqlPath, "utf8");

/** Pisah per statement (abaikan baris komentar) */
function splitStatements(source) {
  return source
    .split(";")
    .map((s) =>
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim()
    )
    .filter(Boolean);
}

async function runViaManagementApi(token) {
  if (!PROJECT_REF) throw new Error("PROJECT_REF tidak ditemukan dari URL Supabase");

  const statements = splitStatements(sql);
  console.log(`Menjalankan ${statements.length} perintah SQL via Management API...\n`);

  for (let i = 0; i < statements.length; i++) {
    const query = statements[i] + ";";
    const res = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    const body = await res.text();
    if (!res.ok) {
      throw new Error(
        `Statement ${i + 1} gagal (${res.status}):\n${query.slice(0, 120)}...\n${body}`
      );
    }
    console.log(`  OK ${i + 1}/${statements.length}`);
  }
}

async function runViaPg(password) {
  const { default: pg } = await import("pg");
  if (!PROJECT_REF) throw new Error("PROJECT_REF tidak ditemukan");

  const host = process.env.SUPABASE_DB_HOST || `db.${PROJECT_REF}.supabase.co`;
  const connectionString =
    process.env.DATABASE_URL ||
    `postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/postgres`;

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Terhubung ke Postgres. Menjalankan schema...\n");

  try {
    await client.query(sql);
    console.log("Schema berhasil dijalankan.");
  } finally {
    await client.end();
  }
}

async function main() {
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (accessToken) {
    await runViaManagementApi(accessToken);
    console.log("\nSelesai.");
    return;
  }

  if (dbPassword) {
    await runViaPg(dbPassword);
    console.log("\nSelesai.");
    return;
  }

  console.error(`
Tidak bisa menjalankan schema — tambahkan di .env.local salah satu:

1) SUPABASE_ACCESS_TOKEN=sbp_...
   Buat di: https://supabase.com/dashboard/account/tokens
   (centang permission database write)

2) SUPABASE_DB_PASSWORD=password_database_anda
   Dari: Supabase Dashboard → Project Settings → Database

Lalu jalankan: npm.cmd run db:setup
`);
  process.exit(1);
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
