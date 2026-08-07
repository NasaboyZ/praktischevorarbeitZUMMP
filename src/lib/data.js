// ── Data Model & Serialization ──────────────────────────────────────────────

export function generateSessionId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function buildDataModel(userData, timelineDays = 1) {
  const { name, mood, text, images, audio, date } = userData;
  const baseDate = date ? new Date(date) : new Date();

  const entries = [];
  for (let i = 0; i < Math.min(timelineDays, 365 * 10); i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];

    if (i === 0) {
      // Real entry from user input
      const entry = { date: iso, mood, text: text || '' };
      if (images.length) entry.images = images.map((img) => ({ id: img.id, type: img.type, size: img.size }));
      if (audio)          entry.audio = { id: 'audio_001', type: audio.type, duration: audio.duration };
      entries.push(entry);
    } else {
      // Simulated historical entries
      const m = [4, 3, 5, 4, 2, 5, 3][i % 7];
      entries.push({ date: iso, mood: m, text: i < 30 ? `Simulated entry for day ${i}` : '' });
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
  // Slider 0-100 maps to 1 day – 3650 days (10 years) exponentially
  if (sliderValue <= 0)   return 1;
  if (sliderValue >= 100) return 3650;
  const v = sliderValue / 100;
  return Math.round(Math.exp(v * Math.log(3650)));
}

export function formatTimeline(days) {
  if (days <= 1)    return '1 Tag';
  if (days <= 7)    return `${days} Tage`;
  if (days <= 30)   return `${Math.round(days / 7)} Wochen`;
  if (days <= 365)  return `${Math.round(days / 30)} Monate`;
  const y = days / 365;
  return y < 2 ? '1 Jahr' : `${Math.round(y)} Jahre`;
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
