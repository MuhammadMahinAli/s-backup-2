// client-only

export function getOrCreateAnonId(): string {
  const KEY = "shy_anon_id";
  let id = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
    // also mirror in a cookie so server routes can read it if needed
    document.cookie = `shy_anon_id=${id}; path=/; max-age=${60*60*24*365*2}`;
  }
  return id!;
}

export function readAnonIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )shy_anon_id=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

