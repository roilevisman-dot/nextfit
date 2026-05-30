type Entry = { data: unknown; ts: number };
const _store: Record<string, Entry> = {};
const TTL = 60_000; // stale after 1 minute

export const pageCache = {
  get<T>(key: string): T | null {
    const e = _store[key];
    if (!e || Date.now() - e.ts > TTL) return null;
    return e.data as T;
  },
  set(key: string, data: unknown) {
    _store[key] = { data, ts: Date.now() };
  },
  invalidate(prefix: string) {
    Object.keys(_store).forEach((k) => { if (k.startsWith(prefix)) delete _store[k]; });
  },
};
