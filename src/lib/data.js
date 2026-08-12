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

// Rotating fallback moods for simulated historical entries (stress-test timeline only)
const SIMULATED_MOODS = [
  ['entspannt'], ['zufrieden', 'dankbar'], ['gestresst'], ['aufgeregt'],
  ['traurig'], ['zufrieden'], ['genervt', 'wuetend'],
];

export function buildDataModel(userData, timelineDays = 1) {
  const { name, moods, location, text, images, audio, date } = userData;
  const baseDate = date ? new Date(date) : new Date();

  const entries = [];
  for (let i = 0; i < Math.min(timelineDays, 365); i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];

    if (i === 0) {
      // Real entry from user input
      const entry = { date: iso, moods: moods || [], location: location || [], text: text || '' };
      if (images.length) entry.images = images.map((img) => ({ id: img.id, type: img.type, size: img.size }));
      if (audio)          entry.audio = { id: 'audio_001', type: audio.type, duration: audio.duration };
      entries.push(entry);
    } else {
      // Simulated historical entries
      entries.push({
        date: iso,
        moods: SIMULATED_MOODS[i % SIMULATED_MOODS.length],
        text: i < 30 ? `Simulated entry for day ${i}` : '',
      });
    }
  }

  return {
    version: 1,
    type: 'mood_export',
    session_id: userData.sessionId || 'DEMO',
    created_at: new Date().toISOString(),
    config: { days: timelineDays, has_media: images.length > 0 || !!audio },
    author: name || 'Anonymous',
    entries,
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
  const { entries, ...meta } = dataModel;
  const n = entries.length;
  const chunk = Math.ceil(n / 3);

  const layer1Data = { ...meta, entries: entries.slice(0, Math.min(chunk, entries.length)) };
  const layer2Data = { session_id: meta.session_id, entries: entries.slice(chunk, chunk * 2) };
  const layer3Data = { session_id: meta.session_id, entries: entries.slice(chunk * 2) };

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
