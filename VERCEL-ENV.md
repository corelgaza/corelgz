# Environment Variables di Vercel

Salin **tanpa tanda kutip** di kolom Value.

| Name | Contoh | Wajib |
|------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://annrprbyqfsccmqhjrhb.supabase.co` | Ya |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (role **anon**) | Ya |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (role **service_role**) | Ya |
| `NEXT_PUBLIC_SITE_URL` | `https://corelgz.vercel.app` | Ya (pakai **https://**) |

**Jangan** tambahkan di Vercel:
- `SUPABASE_DB_PASSWORD` (hanya untuk skrip lokal)
- Tanda kutip di value (`"https://..."` ❌)

Setelah mengubah env → **Deployments → Redeploy** (centang clear cache jika ada).
