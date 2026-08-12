// ── Data Model & Serialization ──────────────────────────────────────────────

export function generateSessionId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// 'YYYY-MM-DD' <-> local Date, avoiding the UTC-parsing day-shift bug of `new Date(isoString)`
export function isoToLocalDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function localDateToIso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysIso(iso, days) {
  return localDateToIso(new Date(isoToLocalDate(iso).getTime() + days * 86400000));
}

export function createEmptyEntry(dateIso) {
  return { date: dateIso, moods: [], location: [], text: '', images: [], audio: null };
}

// A rich entry as it appears inside the QR/session data model.
function serializeEntry(entry) {
  const out = { date: entry.date, moods: entry.moods || [], location: entry.location || [], text: entry.text || '' };
  if (entry.images?.length) out.images = entry.images.map((img) => ({ id: img.id, type: img.type, size: img.size }));
  if (entry.audio) out.audio = { id: `audio_${entry.date}`, type: entry.audio.type, duration: entry.audio.duration };
  return out;
}

// entries: array of real, user-entered daily entries (one per date, most recent first).
export function buildDataModel(entries, meta = {}) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return {
    version: 1,
    type: 'mood_export',
    session_id: meta.sessionId || 'DEMO',
    created_at: new Date().toISOString(),
    config: { entry_count: entries.length },
    author: meta.name || 'Anonymous',
    entries: sorted.map(serializeEntry),
  };
}

export function buildPayload(entries, meta = {}) {
  const model = buildDataModel(entries, meta);
  const mediaData = {};

  entries.forEach((entry) => {
    entry.images?.forEach((img) => { mediaData[img.id] = { dataUrl: img.dataUrl, type: img.type }; });
    if (entry.audio) mediaData[`audio_${entry.date}`] = { dataUrl: entry.audio.dataUrl, type: entry.audio.type };
  });

  return { model, mediaData };
}

// Split entries round-robin across the 3 layers so each channel stays evenly busy.
// L1 additionally carries the session meta (session/author/created_at).
export function splitDataForLayers(dataModel) {
  const { entries, ...meta } = dataModel;
  const buckets = [[], [], []];
  entries.forEach((entry, i) => buckets[i % 3].push(entry));

  return buckets.map((bucketEntries, i) =>
    JSON.stringify(i === 0
      ? { ...meta, entries: bucketEntries }
      : { session_id: meta.session_id, entries: bucketEntries })
  );
}

// Real per-layer byte size (JSON share + attached media), following the same
// round-robin distribution as splitDataForLayers — for the "Datenverteilung
// auf Ebenen" breakdown.
export function getLayerSizes(entries) {
  const buckets = [0, 0, 0];
  entries.forEach((entry, i) => {
    let size = new TextEncoder().encode(JSON.stringify(serializeEntry(entry))).length;
    entry.images?.forEach((img) => { size += img.size || 0; });
    if (entry.audio) size += entry.audio.size || 0;
    buckets[i % 3] += size;
  });
  return buckets;
}

export function calculateDataSize(entries, meta = {}) {
  const model = buildDataModel(entries, meta);
  let base = new TextEncoder().encode(JSON.stringify(model)).length;

  entries.forEach((entry) => {
    entry.images?.forEach((img) => { base += img.size || 0; });
    if (entry.audio) base += entry.audio.size || 0;
  });

  return base;
}

export function formatSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// QR max capacity in bytes per error correction level (Version 40)
// L: 2953, M: 2331, Q: 1663, H: 1273
export const QR_CAPACITY_BY_LEVEL = { L: 2953, M: 2331, Q: 1663, H: 1273 };

// Demo uses Level M (15 % Fehlerkorrektur) — Standard für viele Anwendungen
const QR_CAPACITY = QR_CAPACITY_BY_LEVEL.M;

export function getCapacityInfo(dataSizeBytes, qrCapacity = QR_CAPACITY) {
  const pct = Math.min(dataSizeBytes / qrCapacity, 1);
  const exceeded = dataSizeBytes > qrCapacity;
  let level = 'ok';
  if (pct > 0.85) level = 'err';
  else if (pct > 0.6) level = 'warn';
  return { pct, exceeded, level, capacity: qrCapacity };
}
