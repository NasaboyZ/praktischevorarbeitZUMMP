// ── Realtime via Ably — chunked protocol for large media ─────────────────
import * as Ably from 'ably';

const KEY = import.meta.env.VITE_ABLY_KEY;
const ch  = (id) => `mlqr:${id}`;

export function hasAblyKey() { return !!KEY; }
export function getMobileBaseUrl() { return window.location.origin; }

// Split a string into ≤48 KB slices (Ably free limit is 65 KB per message)
const CHUNK = 48000;
function toChunks(str) {
  const out = [];
  for (let i = 0; i < str.length; i += CHUNK) out.push(str.slice(i, i + CHUNK));
  return out;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Desktop ───────────────────────────────────────────────────────────────
export function connectDesktop(sessionId, callbacks = {}) {
  if (!KEY) { setTimeout(() => callbacks.onError?.(), 0); return { close: () => {}, channel: null }; }

  const client  = new Ably.Realtime({ key: KEY, clientId: `desktop-${sessionId}` });
  const channel = client.channels.get(ch(sessionId));

  client.connection.once('connected', () => callbacks.onOpen?.());
  client.connection.on('failed',       () => callbacks.onError?.());

  channel.subscribe('mobile_joined', (msg) => callbacks.onMobileConnected?.(msg.data));

  return { client, channel, close: () => client.close() };
}

// Send full payload in chunks: payload_model → media_chunk(s) → payload_done
export async function sendPayload(conn, payload) {
  if (!conn?.channel) return false;
  const { model, mediaData = {} } = payload;
  const pub = (name, data) => conn.channel.publish(name, data);

  // 1. JSON model (always small)
  await pub('payload_model', model);

  // 2. Each media item, chunked
  for (const [id, media] of Object.entries(mediaData)) {
    const chunks = toChunks(media.dataUrl);
    for (let i = 0; i < chunks.length; i++) {
      await pub('media_chunk', { id, type: media.type, idx: i, total: chunks.length, data: chunks[i] });
      if (i < chunks.length - 1) await sleep(60); // avoid burst rate-limit
    }
  }

  // 3. Signal complete
  await pub('payload_done', { mediaCount: Object.keys(mediaData).length });
  return true;
}

// ── Mobile ────────────────────────────────────────────────────────────────
export function connectMobile(sessionId, callbacks = {}) {
  if (!KEY) { setTimeout(() => callbacks.onError?.(), 0); return { close: () => {} }; }

  const client  = new Ably.Realtime({ key: KEY, clientId: `mobile-${Date.now()}` });
  const channel = client.channels.get(ch(sessionId));

  // Chunk reassembly state
  const pendingModel  = { value: null };
  const pendingChunks = {}; // { [id]: { type, parts[], received, total } }

  client.connection.once('connected', () => {
    channel.publish('mobile_joined', { session: sessionId });
    callbacks.onOpen?.();
  });
  client.connection.on('failed', () => callbacks.onError?.());

  channel.subscribe('payload_model', (msg) => {
    pendingModel.value = msg.data;
    callbacks.onReceiving?.();          // show "empfange Daten…" state
  });

  channel.subscribe('media_chunk', (msg) => {
    const { id, type, idx, total, data } = msg.data;
    if (!pendingChunks[id]) pendingChunks[id] = { type, parts: new Array(total).fill(null), received: 0, total };
    if (pendingChunks[id].parts[idx] === null) {
      pendingChunks[id].parts[idx] = data;
      pendingChunks[id].received++;
    }
    const total_received = Object.values(pendingChunks).reduce((s, x) => s + x.received, 0);
    const total_expected = Object.values(pendingChunks).reduce((s, x) => s + x.total, 0);
    callbacks.onProgress?.({ received: total_received, total: total_expected });
  });

  channel.subscribe('payload_done', () => {
    const mediaData = {};
    for (const [id, item] of Object.entries(pendingChunks)) {
      mediaData[id] = { dataUrl: item.parts.join(''), type: item.type };
    }
    callbacks.onData?.({ model: pendingModel.value, mediaData });
  });

  return { client, close: () => client.close() };
}
