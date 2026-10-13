const entries = new Map();
const MAX_ENTRIES = 100;

const get = (key) => {
  const entry = entries.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    entries.delete(key);
    return null;
  }
  return entry.value;
};

const set = (key, value, ttlMs = 15000) => {
  if (entries.size >= MAX_ENTRIES && !entries.has(key)) entries.delete(entries.keys().next().value);
  entries.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
};

const invalidate = (prefix) => {
  for (const key of entries.keys()) if (key.startsWith(prefix)) entries.delete(key);
};

module.exports = { get, set, invalidate };
