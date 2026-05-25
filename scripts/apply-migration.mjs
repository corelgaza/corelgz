/**
 * Jalankan satu file migration ke Supabase via pg (preserves $$ blocks).
 *
 * Usage:
 *   node scripts/apply-migration.mjs supabase/migrations/add_articles.sql
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

const target = process.argv[2];
if (!target) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-sql>");
  process.exit(1);
}
const sqlPath = resolve(root, target);
if (!existsSync(sqlPath)) {
  console.error(`File tidak ditemukan: ${sqlPath}`);
  process.exit(1);
}
const sql = readFileSync(sqlPath, "utf8");

const PROJECT_REF =
  process.env.SUPABASE_PROJECT_REF ||
  process.env.NEXT_PUBLIC_SUPABASE_URL?.match(
    /https:\/\/([^.]+)\.supabase\.co/
  )?.[1];

const password = process.env.SUPABASE_DB_PASSWORD;

if (!PROJECT_REF || !password) {
  console.error(
    "Butuh NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD di .env.local"
  );
  process.exit(1);
}

const host = process.env.SUPABASE_DB_HOST || `db.${PROJECT_REF}.supabase.co`;
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://postgres:${encodeURIComponent(
    password
  )}@${host}:5432/postgres`;

const { default: pg } = await import("pg");
const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log(`Terhubung. Menjalankan: ${target}\n`);

try {
  await client.query(sql);
  console.log("✓ Migration sukses.");
} catch (err) {
  console.error("✗ Error:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
