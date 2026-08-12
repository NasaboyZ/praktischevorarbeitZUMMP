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

// Single-letter mood codes for compact historical stress-test data (365 days must
// fit next to the real, rich entry — one JSON object per day would blow the budget)
const SIMULATED_MOOD_CYCLE = ['e', 'z', 'g', 'a', 't', 'z', 'n']; // entspannt/zufrieden/gestresst/aufgeregt/traurig/zufrieden/genervt

export function buildDataModel(userData, timelineDays = 1) {
  const { name, moods, location, text, images, audio, date } = userData;

  // Real entry from user input — the only entry that carries full rich data
  const realEntry = { date, moods: moods || [], location: location || [], text: text || '' };
  if (images.length) realEntry.images = images.map((img) => ({ id: img.id, type: img.type, size: img.size }));
  if (audio)          realEntry.audio = { id: 'audio_001', type: audio.type, duration: audio.duration };

  // Simulated history for every prior day, packed as one char/day instead of one object/day
  // — this is what lets a full year (365 days) actually fit inside the QR capacity budget.
  const histLen = Math.max(0, Math.min(timelineDays, 365) - 1);
  let moodHistory = '';
  for (let i = 0; i < histLen; i++) moodHistory += SIMULATED_MOOD_CYCLE[i % SIMULATED_MOOD_CYCLE.length];

  return {
    version: 1,
    type: 'mood_export',
    session_id: userData.sessionId || 'DEMO',
    created_at: new Date().toISOString(),
    config: { days: timelineDays, has_media: images.length > 0 || !!audio },
    author: name || 'Anonymous',
    entries: [realEntry],
    ...(moodHistory ? { mood_history: moodHistory } : {}),
  };
}

export function buildPayload(userData, timelineDays = 1) {
  const model = buildDataModel(userData, timelineDays);
  const mediaData = {};

  if (userData.images?.length) {
    userData.images.forEach((img) => {
      mediaData[img.id] = { dataUrl: img.dataUrl, type: img.type };
    });
  }
  if (userData.audio) {
    mediaData['audio_001'] = { dataUrl: userData.audio.dataUrl, type: userData.audio.type };
  }

  return { model, mediaData };
}

export function splitDataForLayers(dataModel) {
  const { entries, mood_history, ...meta } = dataModel;
  const hist = mood_history || '';
  const third = Math.ceil(hist.length / 3);

  // L1 carries the rich real entry + session meta; the compact year-long mood
  // history is spread evenly across all three channels so every layer stays busy.
  const layer1Data = { ...meta, entries, mood_history: hist.slice(0, third) };
  const layer2Data = { session_id: meta.session_id, mood_history: hist.slice(third, third * 2) };
  const layer3Data = { session_id: meta.session_id, mood_history: hist.slice(third * 2) };

  return [
    JSON.stringify(layer1Data),
    JSON.stringify(layer2Data),
    JSON.stringify(layer3Data),
  ];
}

export function calculateDataSize(userData, timelineDays) {
  const model = buildDataModel(userData, timelineDays);
  const json = JSON.stringify(model);
  let base = json.length;

  // Add estimated media sizes
  if (userData.images?.length) {
    userData.images.forEach((img) => { base += img.size || 0; });
  }
  if (userData.audio) {
    base += userData.audio.size || 0;
  }

  return base;
}

export function formatSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getTimelineDays(sliderValue) {
  // Slider 0-100 maps to 1 day – 365 days (1 year) exponentially
  if (sliderValue <= 0)   return 1;
  if (sliderValue >= 100) return 365;
  const v = sliderValue / 100;
  return Math.round(Math.exp(v * Math.log(365)));
}

export function formatTimeline(days) {
  if (days <= 1)   return '1 Tag';
  if (days <= 7)   return `${days} Tage`;
  if (days <= 30)  return `${Math.round(days / 7)} Wochen`;
  return `${Math.round(days / 30)} Monate`;
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
