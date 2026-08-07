// ── Realtime via Ably (works on Vercel + local) ──────────────────────────
// Ably key: set VITE_ABLY_KEY in .env.local (dev) or Vercel environment variables
import * as Ably from 'ably';

const KEY = import.meta.env.VITE_ABLY_KEY;
const channelName = (sessionId) => `mlqr:${sessionId}`;

export function hasAblyKey() { return !!KEY; }

// Returns the base URL for constructing mobile links
export function getMobileBaseUrl() {
  return window.location.origin;
}

// Desktop: listens for mobile to join, then sends data
export function connectDesktop(sessionId, callbacks = {}) {
  if (!KEY) {
    console.error('[Ably] VITE_ABLY_KEY not set');
    setTimeout(() => callbacks.onError?.(), 0);
    return { close: () => {}, channel: null };
  }

  const client = new Ably.Realtime({ key: KEY, clientId: `desktop-${sessionId}` });
  const channel = client.channels.get(channelName(sessionId));

  client.connection.once('connected', () => callbacks.onOpen?.());
  client.connection.on('failed',      () => callbacks.onError?.());
  client.connection.on('disconnected',() => callbacks.onClose?.());

  channel.subscribe('mobile_joined', (msg) => callbacks.onMobileConnected?.(msg.data));

  return { client, channel, close: () => client.close() };
}

// Publish full payload to mobile
export function sendPayload(conn, payload) {
  if (conn?.channel) {
    conn.channel.publish('data', payload);
    return true;
  }
  return false;
}

// Mobile: announces presence and listens for data
export function connectMobile(sessionId, callbacks = {}) {
  if (!KEY) {
    setTimeout(() => callbacks.onError?.(), 0);
    return { close: () => {} };
  }

  const client = new Ably.Realtime({ key: KEY, clientId: `mobile-${Date.now()}` });
  const channel = client.channels.get(channelName(sessionId));

  client.connection.once('connected', () => {
    // Announce to desktop that mobile has joined
    channel.publish('mobile_joined', { session: sessionId });
    callbacks.onOpen?.();
  });

  channel.subscribe('data', (msg) => callbacks.onData?.(msg.data));
  client.connection.on('failed', () => callbacks.onError?.());

  return { client, close: () => client.close() };
}
