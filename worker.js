// API klik GenStyle: hanya menangani /api/*. File situs disajikan langsung oleh Cloudflare Assets.
let salt = null;

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Garam rahasia disimpan di database (bukan di repositori) supaya penanda pengunjung tidak bisa ditebak.
async function getSalt(env) {
  if (salt) return salt;
  let row = await env.DB.prepare("SELECT v FROM meta WHERE k='salt'").first();
  if (!row) {
    const v = crypto.randomUUID() + crypto.randomUUID();
    await env.DB.prepare("INSERT OR IGNORE INTO meta(k,v) VALUES('salt',?)").bind(v).run();
    row = await env.DB.prepare("SELECT v FROM meta WHERE k='salt'").first();
  }
  salt = row.v;
  return salt;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      // Top 5 produk dengan pengunjung unik terbanyak dalam 7 hari terakhir
      if (url.pathname === "/api/top" && request.method === "GET") {
        const since = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
        const { results } = await env.DB
          .prepare(
            "SELECT product_id AS id, COUNT(*) AS count FROM clicks WHERE day >= ? GROUP BY product_id ORDER BY count DESC, id ASC LIMIT 5"
          )
          .bind(since)
          .all();
        return json({ top: results }, 200, { "Cache-Control": "public, max-age=60" });
      }

      // Catat klik tombol "Menuju Ke Toko" (1 pengunjung dihitung 1 kali per produk per hari)
      if (url.pathname === "/api/click" && request.method === "POST") {
        const origin = request.headers.get("Origin");
        let sameSite = false;
        try {
          sameSite = !!origin && new URL(origin).host === url.host;
        } catch (e) {}
        if (!sameSite) return json({ error: "forbidden" }, 403);

        let body;
        try {
          body = await request.json();
        } catch (e) {
          return json({ error: "bad request" }, 400);
        }
        const id = body && typeof body.id === "string" ? body.id : "";
        if (!/^[a-z0-9-]{1,60}$/.test(id)) return json({ error: "bad id" }, 400);

        const ip = request.headers.get("CF-Connecting-IP") || "unknown";
        const day = new Date().toISOString().slice(0, 10);
        const visitor = await sha256((await getSalt(env)) + "|" + day + "|" + ip);

        // Batasi spam: maksimal 30 produk berbeda per pengunjung per hari
        const used = await env.DB
          .prepare("SELECT COUNT(*) AS n FROM clicks WHERE visitor = ? AND day = ?")
          .bind(visitor, day)
          .first();
        if (used && used.n >= 30) return json({ error: "limit" }, 429);

        await env.DB
          .prepare("INSERT OR IGNORE INTO clicks (product_id, visitor, day) VALUES (?, ?, ?)")
          .bind(id, visitor, day)
          .run();

        // Bersih-bersih sesekali: hapus data lebih dari 30 hari
        if (Math.random() < 0.02) {
          const old = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
          await env.DB.prepare("DELETE FROM clicks WHERE day < ?").bind(old).run();
        }
        return json({ ok: true }, 202);
      }
    } catch (e) {
      return json({ error: "server" }, 500);
    }
    return json({ error: "not found" }, 404);
  },
};
